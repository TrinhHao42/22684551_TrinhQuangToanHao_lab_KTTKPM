const { Content, User, Menu } = require("./models");

class ContentRepository {
  findAll() {
    return Content.find().populate("author", "username role").sort({ createdAt: -1 });
  }

  findById(id) {
    return Content.findById(id).populate("author", "username role");
  }

  create(payload) {
    return Content.create(payload);
  }

  update(id, payload) {
    return Content.findByIdAndUpdate(id, payload, { new: true });
  }

  remove(id) {
    return Content.findByIdAndDelete(id);
  }
}

class UserRepository {
  findAll() {
    return User.find().sort({ createdAt: -1 });
  }

  findById(id) {
    return User.findById(id);
  }

  findByUsername(username) {
    return User.findOne({ username });
  }

  create(payload) {
    return User.create(payload);
  }

  updatePasswordHash(id, passwordHash) {
    return User.findByIdAndUpdate(id, { passwordHash }, { new: true });
  }

  updateRole(id, role) {
    return User.findByIdAndUpdate(id, { role }, { new: true });
  }
}

class MenuRepository {
  findAll() {
    return Menu.find().sort({ order: 1, createdAt: -1 });
  }

  create(payload) {
    return Menu.create(payload);
  }

  update(id, payload) {
    return Menu.findByIdAndUpdate(id, payload, { new: true });
  }

  remove(id) {
    return Menu.findByIdAndDelete(id);
  }
}

module.exports = {
  contentRepository: new ContentRepository(),
  userRepository: new UserRepository(),
  menuRepository: new MenuRepository(),
};
