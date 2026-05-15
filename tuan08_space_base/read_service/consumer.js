require("dotenv").config();

const amqp = require("amqplib");
const redis = require("./redis");

const QUEUE = "read-events";

async function start() {
  const conn = await amqp.connect(process.env.AMQP_URL);
  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE);

  console.log("Read Service running...");

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;

    try {
      const event = JSON.parse(msg.content.toString());

      const key = `cart:${event.userId}`;

      // warm cache
      for (const [productId, qty] of Object.entries(event.cart || {})) {
        await redis.hset(key, productId, qty);
      }

      await redis.expire(key, 3600);

      channel.ack(msg);

    } catch (err) {
      console.log(err);
      channel.nack(msg, false, true);
    }
  });
}

start();