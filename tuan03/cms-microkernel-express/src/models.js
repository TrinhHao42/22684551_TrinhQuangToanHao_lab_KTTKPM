const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor", "contributor"], default: "contributor" },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "MKUser", required: true },
  },
  { timestamps: true }
);

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model("MKUser", userSchema);
const Post = mongoose.model("MKPost", postSchema);
const Menu = mongoose.model("MKMenu", menuSchema);

module.exports = { User, Post, Menu };
