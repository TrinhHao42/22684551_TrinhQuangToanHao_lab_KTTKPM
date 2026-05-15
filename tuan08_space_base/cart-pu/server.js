require("dotenv").config();

const express = require("express");
const cors = require("cors");

const cartRoutes = require("./routes/cartRoutes");
const { connectRabbitMQ } = require("./config/rabbitmq");

const app = express();

app.use(express.json());
app.use(cors());

connectRabbitMQ();

app.use("/cart", cartRoutes);

app.get("/", (req, res) => {
  res.send("Cart PU running");
});

app.listen(process.env.PORT, () => {
  console.log("Cart PU running on", process.env.PORT);
});