import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plane, MapPin, CreditCard, CheckCircle, User, LogOut, Loader2 } from 'lucide-react';
import './App.css';

const ORCHESTRATOR_URL = 'http://localhost:8080';

function App() {
  const [user, setUser] = useState(null);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [credentials, setCredentials] = useState({ username: 'toanhao', password: 'password123' });

  useEffect(() => {
    if (user) {
      fetchTours();
    }
  }, [user]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ORCHESTRATOR_URL}/tours`);
      setTours(response.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${ORCHESTRATOR_URL}/login`, credentials);
      setUser(response.data);
      setMessage({ type: 'success', text: `Welcome back, ${response.data.name}!` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Login failed. Please check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBookTour = async (tourId) => {
    setBookingLoading(tourId);
    try {
      const response = await axios.post(`${ORCHESTRATOR_URL}/book-tour`, {
        userId: user.id,
        tourId: tourId
      });
      setMessage({ 
        type: 'success', 
        text: `Booking Successful! Transaction ID: ${response.data.transactionId}` 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Booking failed. Please try again.' 
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setTours([]);
    setMessage(null);
  };

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="logo">
            <Plane size={40} className="logo-icon" />
            <h1>TravelEase</h1>
          </div>
          <p className="subtitle">Sign in to book your dream tour</p>
          
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Username</label>
              <input 
                type="text" 
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required 
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required 
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <Loader2 className="spinner" /> : 'Login'}
            </button>
          </form>
          {message && <div className={`message ${message.type}`}>{message.text}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <div className="header-content">
          <div className="logo">
            <Plane size={24} />
            <span>TravelEase</span>
          </div>
          <div className="user-nav">
            <div className="user-info">
              <User size={18} />
              <span>{user.name}</span>
            </div>
            <button onClick={handleLogout} className="btn-icon">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <h1>Explore the World</h1>
          <p>Find and book the best tours managed by our SOA Orchestrator.</p>
        </section>

        {message && (
          <div className={`notification ${message.type}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <CreditCard size={20} />}
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="close-btn">&times;</button>
          </div>
        )}

        <section className="tour-list">
          <h2>Available Tours</h2>
          {loading ? (
            <div className="loading-state">
              <Loader2 className="spinner" size={40} />
              <p>Loading tours...</p>
            </div>
          ) : (
            <div className="tour-grid">
              {tours.map(tour => (
                <div key={tour.id} className="tour-card">
                  <div className="tour-image-placeholder">
                    <MapPin size={48} />
                  </div>
                  <div className="tour-content">
                    <h3>{tour.name}</h3>
                    <p className="description">{tour.description}</p>
                    <div className="tour-footer">
                      <span className="price">${tour.price}</span>
                      <button 
                        onClick={() => handleBookTour(tour.id)} 
                        disabled={bookingLoading === tour.id}
                        className="btn-book"
                      >
                        {bookingLoading === tour.id ? <Loader2 className="spinner" /> : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
