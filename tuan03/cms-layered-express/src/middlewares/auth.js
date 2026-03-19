function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  return next();
}

function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).render("error", {
        user: req.session.user,
        title: "Forbidden",
        message: "Bạn không có quyền thực hiện thao tác này.",
      });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRoles };
