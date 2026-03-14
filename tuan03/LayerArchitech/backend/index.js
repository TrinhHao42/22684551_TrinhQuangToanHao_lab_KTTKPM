const express = require("express");

const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const menuRoutes = require("./routes/menuRoutes");

const app = express();

app.use(express.json());

app.use("/posts", postRoutes);
app.use("/users", userRoutes);
app.use("/menus", menuRoutes);

app.listen(3000, () => {
    console.log("CMS server running on port 3000");
});