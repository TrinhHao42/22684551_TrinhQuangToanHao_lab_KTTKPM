const express = require("express");
const {
  authController,
  homeController,
  contentController,
  userController,
  menuController,
} = require("./controllers");
const { requireAuth, requireRoles } = require("./middlewares/auth");

const router = express.Router();

router.get("/login", authController.loginPage);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.get("/", requireAuth, homeController.dashboard);

router.get("/contents", requireAuth, contentController.list);
router.get("/contents/new", requireAuth, contentController.newPage);
router.post("/contents", requireAuth, contentController.create);
router.get("/contents/:id/edit", requireAuth, contentController.editPage);
router.put("/contents/:id", requireAuth, contentController.update);
router.delete("/contents/:id", requireAuth, contentController.remove);

router.get("/users", requireRoles("admin"), userController.list);
router.get("/users/new", requireRoles("admin"), userController.newPage);
router.post("/users", requireRoles("admin"), userController.create);
router.put("/users/:id/role", requireRoles("admin"), userController.updateRole);

router.get("/menus", requireAuth, menuController.list);
router.post("/menus", requireRoles("admin", "editor"), menuController.create);
router.put("/menus/:id", requireRoles("admin", "editor"), menuController.update);
router.delete("/menus/:id", requireRoles("admin", "editor"), menuController.remove);

module.exports = router;
