const express = require('express');
const cors = require('cors');
const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());

const users = [
  { id: '1', username: 'toanhao', password: 'password123', name: 'Trịnh Quang Toàn Hảo' },
  { id: '2', username: 'admin', password: 'adminpassword', name: 'System Admin' }
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.listen(port, () => {
  console.log(`User Service running at http://localhost:${port}`);
});
