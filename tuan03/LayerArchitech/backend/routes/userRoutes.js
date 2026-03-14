const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const checkRole = require("../middleware/checkRole");

router.post("/", checkRole("ADMIN"), userController.createUser);

router.get("/", checkRole("ADMIN"), userController.getUsers);

module.exports = router;