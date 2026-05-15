const amqp = require("amqplib");

let channel;

async function connectRabbitMQ() {
  const conn = await amqp.connect(process.env.AMQP_URL);
  channel = await conn.createChannel();

  console.log("RabbitMQ connected");
}

function getChannel() {
  return channel;
}

module.exports = {
  connectRabbitMQ,
  getChannel,
};