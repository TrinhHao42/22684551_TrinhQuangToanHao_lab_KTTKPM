require("dotenv").config();

const amqp = require("amqplib");
const db = require("./db");

const QUEUE = "write-events";

async function start() {
  const conn = await amqp.connect(process.env.AMQP_URL);
  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE);

  console.log("Write Service running...");

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;

    try {
      const event = JSON.parse(msg.content.toString());
      console.log("run event")
      await db.execute(
        `
        INSERT INTO cart_logs(user_id, product_id, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
        quantity = quantity + VALUES(quantity)
        `,
        [event.userId, event.productId, event.quantity]
      );

      channel.ack(msg);

    } catch (err) {
      console.log(err);
      channel.nack(msg, false, true);
    }
  });
}

start();