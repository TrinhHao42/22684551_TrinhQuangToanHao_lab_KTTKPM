const express = require("express");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

const QUEUE_NAME = "email_queue";
let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect("amqp://admin:admin123@localhost:5672");
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  console.log("Kết nối RabbitMQ thành công");
}

app.post("/order", async (req, res) => {
  const email = req.body;

  const startTime = Date.now();
  const orderId = Date.now();

  const order = { id: orderId, email };

  await new Promise((resolve) => {
    setTimeout(() => {
      console.log("Tạo đơn hàng:", order);
      resolve();
    }, 2000);
  });

  const message = JSON.stringify(order);
  channel.sendToQueue(QUEUE_NAME, Buffer.from(message), {
    persistent: true,
  });

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  console.log(`Hoàn thành công việc trong ${duration}s`);

  res.json({
    success: true,
    orderId: order.id,
    email: order.email,
    duration: `${duration}s`,
  });
});

app.listen(3000, async () => {
  await connectRabbitMQ();
  console.log("Order API (WITH MQ) chạy tại port 3000");
});
