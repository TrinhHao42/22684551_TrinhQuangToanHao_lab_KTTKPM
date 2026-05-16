const express = require('express');
const mysql = require('mysql2/promise');
const amqp = require('amqplib');

const app = express();
app.use(express.json());
const port = 8083;
let pool;
let channel;

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
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      food_id INT,
      status VARCHAR(50),
      amount INT
    )
  `);
}

async function initRabbit() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await conn.createChannel();
  await channel.assertQueue('ORDER_CREATED', { durable: true });
}

app.post('/', async (req, res) => {
  const { user_id, food_id, amount } = req.body;
  const [result] = await pool.query('INSERT INTO orders (user_id, food_id, status, amount) VALUES (?, ?, ?, ?)', [user_id, food_id, 'CREATED', amount]);
  const orderId = result.insertId;
  const order = { id: orderId, user_id, food_id, status: 'CREATED', amount };
  channel.sendToQueue('ORDER_CREATED', Buffer.from(JSON.stringify(order)), { persistent: true });
  res.status(201).send(order);
});

app.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM orders');
  res.send(rows);
});

app.get('/:id', async (req, res) => {
  const id = req.params.id;
  const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
  if (!rows[0]) return res.status(404).send({ error: 'Not found' });
  res.send(rows[0]);
});

app.listen(port, async () => {
  await initDb();
  await initRabbit();
  console.log('Order service listening on', port);
});
