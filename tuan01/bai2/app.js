const express = require('express');

const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});