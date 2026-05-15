const cartService = require("../services/cartService");

async function addToCart(req, res) {
  const { userId, productId, quantity } = req.body;

  const result = await cartService.addToCart(
    userId,
    productId,
    quantity
  );

  res.json({ success: true, cart: result });
}

async function getCart(req, res) {
  const { userId } = req.query;

  const result = await cartService.getCart(userId);

  res.json({ success: true, cart: result });
}

async function removeItem(req, res) {
  const { userId, productId } = req.body;

  const result = await cartService.removeItem(userId, productId);

  res.json({ success: true, cart: result });
}

async function updateCart(req, res) {
  const { userId, productId, quantity } = req.body;

  const result = await cartService.updateCart(
    userId,
    productId,
    quantity
  );

  res.json({
    success: true,
    cart: result
  });
}

module.exports = {
  addToCart,
  getCart,
  removeItem,
  updateCart
};