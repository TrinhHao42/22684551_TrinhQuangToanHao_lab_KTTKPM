const express = require("express");
const bcrypt = require("bcryptjs");

const userPlugin = {
  meta: {
    name: "user-plugin",
    description: "Manage users and role permissions",
  },

  register({ app, auth, models }) {
    const router = express.Router();

    router.get("/admin/users", auth.requireRole("admin"), async (req, res) => {
      const users = await models.User.find().sort({ createdAt: -1 });
      res.render("users/list", {
        title: "Users Plugin",
        users,
        user: req.user,
      });
    });

    router.post("/admin/users", auth.requireRole("admin"), async (req, res) => {
      const passwordHash = await bcrypt.hash(req.body.password, 10);
      await models.User.create({
        username: req.body.username,
        passwordHash,
        role: req.body.role || "contributor",
      });
      res.redirect("/admin/users");
    });

    router.put("/admin/users/:id/role", auth.requireRole("admin"), async (req, res) => {
      await models.User.findByIdAndUpdate(req.params.id, { role: req.body.role });
      res.redirect("/admin/users");
    });

    app.use(router);
  },
};

module.exports = userPlugin;
