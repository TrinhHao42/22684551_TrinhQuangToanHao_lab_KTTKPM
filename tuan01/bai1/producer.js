const connectRabbitMQ = require("./rabbitMQ");

async function startProducer() {
  const channel = await connectRabbitMQ();
  const queue = "messages";

  await channel.assertQueue(queue, { durable: false });

  for (let count = 1; count <= 5; count++) {
    const message = `user${count}@gmail.com`;

    channel.sendToQueue(queue, Buffer.from(message));

    console.log("Sent:", message);

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  setTimeout(() => {
    process.exit(0);
  }, 500);
}

startProducer().catch(console.error);
