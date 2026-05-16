const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
app.use(express.json());
const port = 8082;
let pool;
async function initDb() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'sapassword',
    database: process.env.DB_NAME || 'appdb',
    waitForConnections: true,
    connectionLimit: 10,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS foods (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200),
      price INT
    )
  `);

  const [rows] = await pool.query('SELECT COUNT(*) as c FROM foods');
  if (rows[0].c === 0) {
    await pool.query('INSERT INTO foods (name, price) VALUES ?',[ [ ['Pho', 50000], ['Banh Mi', 30000], ['Com Suon', 60000] ] ]);
  }
}

app.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM foods');
  res.send(rows);
});

app.get('/:id', async (req, res) => {
  const id = req.params.id;
  const [rows] = await pool.query('SELECT * FROM foods WHERE id = ?', [id]);
  if (!rows[0]) return res.status(404).send({ error: 'Not found' });
  res.send(rows[0]);
});

app.listen(port, async () => {
  await initDb();
  console.log('Food service listening on', port);
});
