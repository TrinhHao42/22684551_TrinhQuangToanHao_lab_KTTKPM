const redis = require("../config/redis");
const { getChannel } = require("../config/rabbitmq");
require('dotenv').config()

// ADD TO CART (WRITE FLOW)
async function addToCart(userId, productId, quantity) {
  const key = `cart:${userId}`;

  // 1. write to Redis first (FAST)
  await redis.hincrby(key, productId, quantity);
  await redis.expire(key, 3600);

  const cart = await redis.hgetall(key);

  // 2. send event to WRITE SERVICE
  const channel = getChannel();

  channel.sendToQueue(
    process.env.WRITE_QUEUE,
    Buffer.from(JSON.stringify({
      userId,
      productId,
      quantity,
      action: "UPSERT"
    }))
  );

  return cart;
}


// GET CART (READ FLOW)
async function getCart(userId) {
  const key = `cart:${userId}`;

  let cart = await redis.hgetall(key);

  // cache hit
  if (Object.keys(cart).length > 0) {
    return cart;
  }

  // cache miss → trigger read service
  const channel = getChannel();

  channel.sendToQueue(
    process.env.READ_QUEUE,
    Buffer.from(JSON.stringify({
      userId,
      action: "CACHE_WARM_REQUEST"
    }))
  );

  return {};
}


// REMOVE ITEM
async function removeItem(userId, productId) {
  const key = `cart:${userId}`;

  await redis.hdel(key, productId);

  return await redis.hgetall(key);
}

async function updateCart(userId, productId, quantity) {
  const key = `cart:${userId}`;

  if (quantity <= 0) {
    await redis.hdel(key, productId);
  } else {
    await redis.hset(key, productId, quantity);
  }

  await redis.expire(key, 3600);

  const cart = await redis.hgetall(key);

  return cart;
}

module.exports = {
  addToCart,
  getCart,
  removeItem,
  updateCart
};