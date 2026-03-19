const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "editor", "contributor"],
      default: "contributor",
    },
  },
  { timestamps: true }
);

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, default: "" },
    mediaUrl: { type: String, default: "" },
    type: {
      type: String,
      enum: ["article", "page", "image", "video"],
      default: "article",
    },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Content = mongoose.model("Content", contentSchema);
const Menu = mongoose.model("Menu", menuSchema);

module.exports = { User, Content, Menu };
