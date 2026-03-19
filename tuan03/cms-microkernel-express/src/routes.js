const express = require("express");
const bcrypt = require("bcryptjs");

function buildCoreRoutes({ models, auth, pluginManager }) {
  const router = express.Router();

  router.get("/login", (req, res) => {
    res.render("auth/login", { title: "Microkernel Login", error: null, user: null });
  });

  router.post("/login", async (req, res) => {
    const user = await models.User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).render("auth/login", {
        title: "Microkernel Login",
        error: "Sai tài khoản hoặc mật khẩu",
        user: null,
      });
    }

    const valid = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!valid) {
      return res.status(401).render("auth/login", {
        title: "Microkernel Login",
        error: "Sai tài khoản hoặc mật khẩu",
        user: null,
      });
    }

    const token = auth.signUserToken(user);
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    return res.redirect("/");
  });

  router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
  });

  router.get("/", auth.requireAuth, async (req, res) => {
    const [users, posts, menus] = await Promise.all([
      models.User.countDocuments(),
      models.Post.countDocuments(),
      models.Menu.countDocuments(),
    ]);

    res.render("home", {
      title: "Microkernel CMS Dashboard",
      user: req.user,
      stats: { users, posts, menus },
      plugins: pluginManager.listPlugins(),
    });
  });

  return router;
}

module.exports = { buildCoreRoutes };
