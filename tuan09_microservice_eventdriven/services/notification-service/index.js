const amqp = require('amqplib');
const redis = require('redis');

async function run() {
  const rclient = redis.createClient({ url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}` });
  await rclient.connect();

  const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue('PAYMENT_SUCCESS', { durable: true });

  ch.consume('PAYMENT_SUCCESS', async (msg) => {
    const payload = JSON.parse(msg.content.toString());
    const text = `Đơn hàng #${payload.order_id} đã thanh toán thành công!`;
    console.log(text);
    await rclient.lPush('notifications', text);
    ch.ack(msg);
  }, { noAck: false });
}

run().catch(e => { console.error(e); process.exit(1); });
