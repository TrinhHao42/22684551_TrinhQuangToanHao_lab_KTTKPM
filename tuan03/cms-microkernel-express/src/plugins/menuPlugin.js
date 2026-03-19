const express = require("express");

const menuPlugin = {
  meta: {
    name: "menu-plugin",
    description: "Manage navigation menus",
  },

  register({ app, auth, models }) {
    const router = express.Router();

    router.get("/admin/menus", auth.requireRole("admin", "editor"), async (req, res) => {
      const menus = await models.Menu.find().sort({ order: 1, createdAt: -1 });
      res.render("menus/list", {
        title: "Menus Plugin",
        user: req.user,
        menus,
      });
    });

    router.post("/admin/menus", auth.requireRole("admin", "editor"), async (req, res) => {
      await models.Menu.create({ name: req.body.name, path: req.body.path, order: req.body.order || 0 });
      res.redirect("/admin/menus");
    });

    router.delete("/admin/menus/:id", auth.requireRole("admin", "editor"), async (req, res) => {
      await models.Menu.findByIdAndDelete(req.params.id);
      res.redirect("/admin/menus");
    });

    app.use(router);
  },
};

module.exports = menuPlugin;
