require("dotenv").config();

const path = require("path");
const express = require("express");
const methodOverride = require("method-override");

const { connectDb } = require("./config/db");
const models = require("./models");
const auth = require("./core/auth");
const { PluginManager } = require("./core/kernel");
const { buildCoreRoutes } = require("./routes");
const userPlugin = require("./plugins/userPlugin");
const postPlugin = require("./plugins/postPlugin");
const menuPlugin = require("./plugins/menuPlugin");
const { ensureAdmin } = require("./seed");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Parse cookies with a tiny parser suitable for demo.
app.use((req, _res, next) => {
  req.cookies = {};
  const raw = req.headers.cookie || "";
  raw.split(";").forEach((pair) => {
    const [k, v] = pair.trim().split("=");
    if (k) {
      req.cookies[k] = decodeURIComponent(v || "");
    }
  });
  next();
});

const pluginManager = new PluginManager({ app, auth, models });

pluginManager.eventBus.on("post:published", ({ postId, by }) => {
  console.log(`[Microkernel Hook] post ${postId} published by ${by}`);
});

app.use(buildCoreRoutes({ models, auth, pluginManager }));

pluginManager.register(userPlugin);
pluginManager.register(postPlugin);
pluginManager.register(menuPlugin);

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).render("error", {
    title: "Unexpected Error",
    message: "Đã có lỗi xảy ra.",
    user: req.user || null,
  });
});

async function bootstrap() {
  await connectDb();
  await ensureAdmin(models);
  const port = Number(process.env.PORT || 3001);
  app.listen(port, () => {
    console.log(`[Microkernel CMS] running at http://localhost:${port}`);
  });
}

bootstrap();
