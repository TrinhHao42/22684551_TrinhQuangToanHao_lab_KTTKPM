const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Service URLs - Can be moved to .env
const USER_SERVICE = 'http://localhost:8081';
const TOUR_SERVICE = 'http://localhost:8082';
const BOOKING_SERVICE = 'http://localhost:8083';
const PAYMENT_SERVICE = 'http://localhost:8084';

app.post('/book-tour', async (req, res) => {
  const { userId, tourId } = req.body;

  try {
    console.log(`Starting booking process for User: ${userId}, Tour: ${tourId}`);

    // 1. Validate User
    let user;
    try {
      const userResponse = await axios.get(`${USER_SERVICE}/users/${userId}`);
      user = userResponse.data;
      console.log('User validated:', user.name);
    } catch (error) {
      return res.status(404).json({ message: 'User validation failed', error: error.message });
    }

    // 2. Get Tour Information
    let tour;
    try {
      const tourResponse = await axios.get(`${TOUR_SERVICE}/tours/${tourId}`);
      tour = tourResponse.data;
      console.log('Tour information retrieved:', tour.name);
    } catch (error) {
      return res.status(404).json({ message: 'Tour information not found', error: error.message });
    }

    // 3. Create Booking
    let booking;
    try {
      const bookingResponse = await axios.post(`${BOOKING_SERVICE}/bookings`, {
        userId: user.id,
        tourId: tour.id,
        amount: tour.price
      });
      booking = bookingResponse.data;
      console.log('Booking created:', booking.id);
    } catch (error) {
      return res.status(500).json({ message: 'Booking creation failed', error: error.message });
    }

    // 4. Call Payment Service
    try {
      const paymentResponse = await axios.post(`${PAYMENT_SERVICE}/payments`, {
        bookingId: booking.id,
        amount: tour.price
      });
      
      console.log('Payment successful:', paymentResponse.data.transactionId);
      
      // 5. Return success result
      return res.json({
        message: 'Tour booked successfully!',
        bookingId: booking.id,
        transactionId: paymentResponse.data.transactionId,
        tour: tour.name,
        user: user.name,
        amount: tour.price
      });

    } catch (error) {
      console.error('Payment failed:', error.response?.data?.message || error.message);
      return res.status(400).json({ 
        message: 'Payment failed', 
        bookingId: booking.id,
        error: error.response?.data?.message || error.message 
      });
    }

  } catch (error) {
    console.error('Unexpected error in Orchestrator:', error.message);
    res.status(500).json({ message: 'Internal server error in Orchestrator', error: error.message });
  }
});

// Added for UI to fetch tours through Orchestrator if needed (though requirement says Frontend calls Orchestrator)
app.get('/tours', async (req, res) => {
    try {
        const response = await axios.get(`${TOUR_SERVICE}/tours`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tours' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const response = await axios.post(`${USER_SERVICE}/login`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(401).json({ message: 'Login failed' });
    }
});

app.listen(port, () => {
  console.log(`Orchestrator Service running at http://localhost:${port}`);
});
