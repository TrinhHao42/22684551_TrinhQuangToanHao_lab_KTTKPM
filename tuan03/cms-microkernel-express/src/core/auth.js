const jwt = require("jsonwebtoken");

const secret = () => process.env.JWT_SECRET || "microkernel-secret";

function signUserToken(user) {
  return jwt.sign(
    { sub: String(user._id), username: user.username, role: user.role },
    secret(),
    { expiresIn: "8h" }
  );
}

function parseAuth(req) {
  const bearer = req.headers.authorization || "";
  const token = req.cookies?.token || (bearer.startsWith("Bearer ") ? bearer.slice(7) : null);
  if (!token) {
    return null;
  }
  try {
    return jwt.verify(token, secret());
  } catch (_e) {
    return null;
  }
}

function requireAuth(req, res, next) {
  const payload = parseAuth(req);
  if (!payload) {
    return res.redirect("/login");
  }
  req.user = payload;
  return next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    const payload = parseAuth(req);
    if (!payload) {
      return res.redirect("/login");
    }
    if (!roles.includes(payload.role)) {
      return res.status(403).render("error", {
        title: "Forbidden",
        message: "Bạn không có quyền thao tác.",
        user: payload,
      });
    }
    req.user = payload;
    return next();
  };
}

module.exports = { signUserToken, parseAuth, requireAuth, requireRole };
