const bcrypt = require("bcryptjs");
const { contentRepository, userRepository, menuRepository } = require("./repositories");

class ContentService {
  list() {
    return contentRepository.findAll();
  }

  get(id) {
    return contentRepository.findById(id);
  }

  create(data, actor) {
    return contentRepository.create({ ...data, author: actor._id });
  }

  async update(id, data, actor) {
    const existing = await contentRepository.findById(id);
    if (!existing) {
      return null;
    }

    const isOwner = String(existing.author._id || existing.author) === String(actor._id);
    const canEditAny = ["admin", "editor"].includes(actor.role);
    if (!isOwner && !canEditAny) {
      const err = new Error("Permission denied");
      err.code = 403;
      throw err;
    }

    if (data.status === "published" && !["admin", "editor"].includes(actor.role)) {
      const err = new Error("Only admin/editor can publish");
      err.code = 403;
      throw err;
    }

    return contentRepository.update(id, data);
  }

  async remove(id, actor) {
    const existing = await contentRepository.findById(id);
    if (!existing) {
      return null;
    }

    const isOwner = String(existing.author._id || existing.author) === String(actor._id);
    const canDelete = actor.role === "admin" || isOwner;
    if (!canDelete) {
      const err = new Error("Permission denied");
      err.code = 403;
      throw err;
    }
    return contentRepository.remove(id);
  }
}

class UserService {
  list() {
    return userRepository.findAll();
  }

  getByUsername(username) {
    return userRepository.findByUsername(username);
  }

  async createUser({ username, password, role }) {
    const passwordHash = await bcrypt.hash(password, 10);
    return userRepository.create({ username, passwordHash, role });
  }

  async resetPassword(id, plainPassword) {
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    return userRepository.updatePasswordHash(id, passwordHash);
  }

  updateRole(id, role) {
    return userRepository.updateRole(id, role);
  }
}

class MenuService {
  list() {
    return menuRepository.findAll();
  }

  create(data) {
    return menuRepository.create(data);
  }

  update(id, data) {
    return menuRepository.update(id, data);
  }

  remove(id) {
    return menuRepository.remove(id);
  }
}

module.exports = {
  contentService: new ContentService(),
  userService: new UserService(),
  menuService: new MenuService(),
};
