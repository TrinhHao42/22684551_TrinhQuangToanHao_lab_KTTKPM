const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const port = 8081;

let pool;

async function initDb() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'appdb',
    waitForConnections: true,
    connectionLimit: 10,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) UNIQUE,
      password VARCHAR(200)
    )
  `);
}

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send({ error: 'Missing' });
  const hash = await bcrypt.hash(password, 10);
  try {
    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
    res.status(201).send({ message: 'User created' });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  const user = rows[0];
  if (!user) return res.status(401).send({ error: 'Invalid' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).send({ error: 'Invalid' });
  const token = jwt.sign({ id: user.id, username: user.username }, 'secret');
  res.send({ token });
});

app.listen(port, async () => {
  await initDb();
  console.log('User service listening on', port);
});
