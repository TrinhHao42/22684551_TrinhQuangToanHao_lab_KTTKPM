const express = require("express");
const router = express.Router();
const controller = require("../controllers/cartController");

router.post("/add", controller.addToCart);
router.get("/", controller.getCart);
router.delete("/remove", controller.removeItem);
router.put("/update", controller.updateCart);

module.exports = router;