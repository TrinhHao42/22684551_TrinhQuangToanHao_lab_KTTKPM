const bcrypt = require("bcryptjs");
const { contentService, userService, menuService } = require("./services");

const authController = {
  loginPage(req, res) {
    res.render("auth/login", { title: "Login", error: null, user: req.session.user || null });
  },

  async login(req, res) {
    const { username, password } = req.body;
    const user = await userService.getByUsername(username);
    if (!user || !user.passwordHash) {
      return res.status(401).render("auth/login", {
        title: "Login",
        error: "Sai tài khoản hoặc mật khẩu",
        user: null,
      });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).render("auth/login", {
        title: "Login",
        error: "Sai tài khoản hoặc mật khẩu",
        user: null,
      });
    }

    req.session.user = { _id: user._id, username: user.username, role: user.role };
    return res.redirect("/");
  },

  logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  },
};

const homeController = {
  async dashboard(req, res) {
    const [contents, menus, users] = await Promise.all([
      contentService.list(),
      menuService.list(),
      userService.list(),
    ]);
    res.render("home", {
      title: "Layered CMS Dashboard",
      user: req.session.user,
      stats: {
        contents: contents.length,
        published: contents.filter((item) => item.status === "published").length,
        menus: menus.length,
        users: users.length,
      },
    });
  },
};

const contentController = {
  async list(req, res) {
    const contents = await contentService.list();
    res.render("content/list", { title: "Content", user: req.session.user, contents });
  },

  newPage(req, res) {
    res.render("content/form", {
      title: "New Content",
      user: req.session.user,
      item: null,
      action: "/contents",
      method: "POST",
    });
  },

  async create(req, res) {
    await contentService.create(req.body, req.session.user);
    res.redirect("/contents");
  },

  async editPage(req, res) {
    const item = await contentService.get(req.params.id);
    if (!item) {
      return res.status(404).render("error", {
        title: "Not Found",
        user: req.session.user,
        message: "Không tìm thấy nội dung",
      });
    }
    return res.render("content/form", {
      title: "Edit Content",
      user: req.session.user,
      item,
      action: `/contents/${item._id}?_method=PUT`,
      method: "POST",
    });
  },

  async update(req, res) {
    try {
      await contentService.update(req.params.id, req.body, req.session.user);
      res.redirect("/contents");
    } catch (err) {
      const status = err.code || 500;
      res.status(status).render("error", {
        title: "Error",
        user: req.session.user,
        message: err.message,
      });
    }
  },

  async remove(req, res) {
    try {
      await contentService.remove(req.params.id, req.session.user);
      res.redirect("/contents");
    } catch (err) {
      const status = err.code || 500;
      res.status(status).render("error", {
        title: "Error",
        user: req.session.user,
        message: err.message,
      });
    }
  },
};

const userController = {
  async list(req, res) {
    const users = await userService.list();
    res.render("users/list", { title: "Users & Roles", user: req.session.user, users });
  },

  newPage(req, res) {
    res.render("users/form", { title: "Create User", user: req.session.user, action: "/users" });
  },

  async create(req, res) {
    await userService.createUser(req.body);
    res.redirect("/users");
  },

  async updateRole(req, res) {
    await userService.updateRole(req.params.id, req.body.role);
    res.redirect("/users");
  },
};

const menuController = {
  async list(req, res) {
    const menus = await menuService.list();
    res.render("menus/list", { title: "Menus", user: req.session.user, menus });
  },

  async create(req, res) {
    await menuService.create(req.body);
    res.redirect("/menus");
  },

  async update(req, res) {
    await menuService.update(req.params.id, req.body);
    res.redirect("/menus");
  },

  async remove(req, res) {
    await menuService.remove(req.params.id);
    res.redirect("/menus");
  },
};

module.exports = {
  authController,
  homeController,
  contentController,
  userController,
  menuController,
};
