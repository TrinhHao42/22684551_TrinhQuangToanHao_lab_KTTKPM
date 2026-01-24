const connectRabbitMQ = require("./rabbitMQ")

async function startConsumer() {
  const channel = await connectRabbitMQ()
  const queue = "messages"

  await channel.assertQueue(queue, { durable: false })

  console.log("📥 Waiting for messages...")

  channel.consume(queue, (msg) => {
    if (msg) {
      const content = msg.content.toString()
      console.log("Received:", content)

      setTimeout(() => {
        channel.ack(msg)
        console.log("send mail:", content)
      }, 1000)
    }
  }, { noAck: false })
}

startConsumer().catch(console.error)
