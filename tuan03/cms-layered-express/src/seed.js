const { userService } = require("./services");

async function ensureDefaultAdmin() {
  const admin = await userService.getByUsername("admin");
  if (!admin) {
    await userService.createUser({ username: "admin", password: "admin123", role: "admin" });
    console.log("[Layered CMS] Default admin created: admin/admin123");
    return;
  }

  if (!admin.passwordHash) {
    await userService.resetPassword(admin._id, "admin123");
    console.log("[Layered CMS] Repaired admin password hash: admin/admin123");
  }

  if (!admin.role) {
    await userService.updateRole(admin._id, "admin");
    console.log("[Layered CMS] Repaired admin role: admin");
  }
}

module.exports = { ensureDefaultAdmin };
