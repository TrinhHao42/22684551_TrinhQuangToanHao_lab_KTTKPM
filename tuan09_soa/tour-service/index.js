const express = require('express');
const cors = require('cors');
const app = express();
const port = 8082;

app.use(cors());
app.use(express.json());

const tours = [
  { id: '1', name: 'Hạ Long Bay Tour', price: 100, description: 'Beautiful cruise in Hạ Long Bay' },
  { id: '2', name: 'Phú Quốc Island', price: 200, description: 'Relaxing beaches in Phú Quốc' },
  { id: '3', name: 'Đà Lạt City', price: 150, description: 'Cool weather and flowers in Đà Lạt' }
];

app.get('/tours', (req, res) => {
  res.json(tours);
});

app.get('/tours/:id', (req, res) => {
  const tour = tours.find(t => t.id === req.params.id);
  if (tour) {
    res.json(tour);
  } else {
    res.status(404).json({ message: 'Tour not found' });
  }
});

app.listen(port, () => {
  console.log(`Tour Service running at http://localhost:${port}`);
});
