const express = require("express");

const postPlugin = {
  meta: {
    name: "post-plugin",
    description: "Manage content posts",
  },

  register({ app, auth, models, eventBus }) {
    const router = express.Router();

    router.get("/admin/posts", auth.requireAuth, async (req, res) => {
      const posts = await models.Post.find().populate("author", "username role").sort({ createdAt: -1 });
      res.render("posts/list", {
        title: "Posts Plugin",
        user: req.user,
        posts,
      });
    });

    router.post("/admin/posts", auth.requireAuth, async (req, res) => {
      const post = await models.Post.create({
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        author: req.user.sub,
      });
      if (post.status === "published") {
        eventBus.emit("post:published", { postId: post._id, by: req.user.username });
      }
      res.redirect("/admin/posts");
    });

    router.put("/admin/posts/:id", auth.requireAuth, async (req, res) => {
      const target = await models.Post.findById(req.params.id);
      if (!target) {
        return res.status(404).render("error", {
          title: "Not Found",
          message: "Không tìm thấy bài viết",
          user: req.user,
        });
      }

      const canEdit = req.user.role === "admin" || req.user.role === "editor" || String(target.author) === req.user.sub;
      if (!canEdit) {
        return res.status(403).render("error", {
          title: "Forbidden",
          message: "Không đủ quyền cập nhật nội dung",
          user: req.user,
        });
      }

      await models.Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
      });
      return res.redirect("/admin/posts");
    });

    router.delete("/admin/posts/:id", auth.requireAuth, async (req, res) => {
      await models.Post.findByIdAndDelete(req.params.id);
      res.redirect("/admin/posts");
    });

    app.use(router);
  },
};

module.exports = postPlugin;
