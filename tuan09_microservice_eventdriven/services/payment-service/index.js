const amqp = require('amqplib');
const mysql = require('mysql2/promise');

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
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      status VARCHAR(50)
    )
  `);
}

async function run() {
  await initDb();
  const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue('ORDER_CREATED', { durable: true });
  await ch.assertQueue('PAYMENT_SUCCESS', { durable: true });
  await ch.assertQueue('PAYMENT_FAILED', { durable: true });

  ch.consume('ORDER_CREATED', async (msg) => {
    const order = JSON.parse(msg.content.toString());
    console.log('Payment service received order', order.id);
    const success = Math.random() < 0.8; // 80% success
    const status = success ? 'SUCCESS' : 'FAILED';
    await pool.query('INSERT INTO payments (order_id, status) VALUES (?, ?)', [order.id, status]);
    const q = success ? 'PAYMENT_SUCCESS' : 'PAYMENT_FAILED';
    ch.sendToQueue(q, Buffer.from(JSON.stringify({ order_id: order.id, status })), { persistent: true });
    ch.ack(msg);
  }, { noAck: false });
}

run().catch(e => { console.error(e); process.exit(1); });
