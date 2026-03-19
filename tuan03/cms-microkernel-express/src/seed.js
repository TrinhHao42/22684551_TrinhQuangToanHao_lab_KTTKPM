const bcrypt = require("bcryptjs");

async function ensureAdmin(models) {
  const existing = await models.User.findOne({ username: "admin" });
  if (!existing) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await models.User.create({ username: "admin", passwordHash, role: "admin" });
    console.log("[Microkernel CMS] Default admin created: admin/admin123");
  }
}

module.exports = { ensureAdmin };
