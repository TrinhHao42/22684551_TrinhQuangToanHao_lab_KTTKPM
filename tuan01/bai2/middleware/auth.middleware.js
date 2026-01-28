const { verifyAccessToken } = require("../config/jwt")

exports.checkToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: "Please login first" })
    }

    const token = authHeader.split(" ")[1]

    const decoded = verifyAccessToken(token)

    req.user = decoded

    next()
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}

exports.checkRole = (roles = []) => {
  return (req, res, next) => {
    const userRole = req.user.role

    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden - No permission you must admin to access this resource" })
    }

    next()
  }
}