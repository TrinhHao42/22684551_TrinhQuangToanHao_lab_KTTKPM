require("dotenv").config();

const path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const { connectDb } = require("./config/db");
const { ensureDefaultAdmin } = require("./seed");
const routes = require("./routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "layered-cms-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

app.use(routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error", {
    title: "Unexpected Error",
    user: req.session?.user || null,
    message: "Đã có lỗi xảy ra, vui lòng thử lại.",
  });
});

async function bootstrap() {
  await connectDb();
  await ensureDefaultAdmin();
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    console.log(`[Layered CMS] running at http://localhost:${port}`);
  });
}

bootstrap();
