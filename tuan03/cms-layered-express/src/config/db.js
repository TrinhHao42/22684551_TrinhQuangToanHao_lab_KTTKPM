const mongoose = require("mongoose");

async function connectDb() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cms_layered";
  await mongoose.connect(uri);
  console.log("[Layered CMS] MongoDB connected");
}

module.exports = { connectDb };
