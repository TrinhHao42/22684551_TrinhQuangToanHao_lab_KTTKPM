const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

const checkRole = require("../middleware/checkRole");

router.post("/", checkRole("ADMIN"), menuController.createMenu);

router.get("/", menuController.getMenus);

module.exports = router;