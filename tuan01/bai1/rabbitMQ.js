const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://admin:admin123@localhost:5672";

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {

    if (channel) {
      return channel;
    }

    console.log("Creating RabbitMQ connection...");

    connection = await amqp.connect(RABBITMQ_URL);

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err);
      connection = null;
      channel = null;
    });

    connection.on("close", () => {
      console.error("RabbitMQ connection closed");
      connection = null;
      channel = null;
    });

    channel = await connection.createChannel();

    console.log("Connected to RabbitMQ");

    return channel;
  } catch (error) {
    console.error("❌ Failed to connect to RabbitMQ", error);
    throw error;
  }
};

module.exports = connectRabbitMQ;
