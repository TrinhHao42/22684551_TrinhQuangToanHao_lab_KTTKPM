const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

const checkRole = require("../middleware/checkRole");

router.post("/", checkRole("AUTHOR"), postController.createPost);

router.get("/", postController.getPosts);

router.put("/:id", checkRole("EDITOR"), postController.updatePost);

router.delete("/:id", checkRole("ADMIN"), postController.deletePost);

module.exports = router;