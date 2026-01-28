const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});