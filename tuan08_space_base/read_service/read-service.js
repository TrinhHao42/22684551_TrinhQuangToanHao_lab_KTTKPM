require("dotenv").config();

const amqp = require("amqplib");
const Redis = require("ioredis");
const mysql = require("mysql2/promise");

// ===================== REDIS =====================
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

// ===================== DB =====================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ===================== QUEUE =====================
const QUEUE = "read-events";

async function start() {
  const connection = await amqp.connect(process.env.AMQP_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE);

  console.log("Read Service started... waiting messages");

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;

    try {
      const event = JSON.parse(msg.content.toString());

      console.log("READ EVENT:", event);

      const key = `cart:${event.userId}`;

      // warm cache Redis
      for (const [productId, quantity] of Object.entries(event.cart || {})) {
        await redis.hset(key, productId, quantity);
      }

      await redis.expire(key, 3600);

      channel.ack(msg);
    } catch (err) {
      console.log("Read error:", err);

      channel.nack(msg, false, true);
    }
  });
}

start();