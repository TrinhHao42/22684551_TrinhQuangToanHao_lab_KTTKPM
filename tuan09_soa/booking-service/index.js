const express = require('express');
const cors = require('cors');
const app = express();
const port = 8083;

app.use(cors());
app.use(express.json());

const bookings = [];

app.post('/bookings', (req, res) => {
  const { userId, tourId, amount } = req.body;
  const booking = {
    id: `B${Date.now()}`,
    userId,
    tourId,
    amount,
    status: 'PENDING',
    createdAt: new Date()
  };
  bookings.push(booking);
  console.log(`New booking created: ${booking.id}`);
  res.status(201).json(booking);
});

app.listen(port, () => {
  console.log(`Booking Service running at http://localhost:${port}`);
});
