const express = require('express');
const cors = require('cors');
const app = express();
const port = 8084;

app.use(cors());
app.use(express.json());

app.post('/payments', (req, res) => {
  const { bookingId, amount } = req.body;
  
  // Random success (80% chance) or fail (20% chance)
  const isSuccess = Math.random() > 0.2;
  
  if (isSuccess) {
    res.json({
      status: 'SUCCESS',
      transactionId: `TXN${Date.now()}`,
      bookingId,
      amount,
      message: 'Payment successful'
    });
  } else {
    res.status(400).json({
      status: 'FAILED',
      bookingId,
      message: 'Payment failed due to insufficient funds'
    });
  }
});

app.listen(port, () => {
  console.log(`Payment Service running at http://localhost:${port}`);
});
