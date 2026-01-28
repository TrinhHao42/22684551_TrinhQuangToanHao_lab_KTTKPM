const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} = require("../config/jwt");

const users = [
  {
    id: 1,
    email: "admin@gmail.com",
    passwordHash: "123456",
    role: "admin"
  },
  {
    id: 2,
    email: "guest@gmail.com",
    passwordHash: "123456",
    role: "guest"
  }
];

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = password === user.passwordHash;
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const payload = {
    userId: user.email,
    role: user.role
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);


  return res.json({
    accessToken,
    refreshToken,
    role: user.role
  });
};

exports.refresh = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    const payload = {
      userId: decoded.userId,
      role: decoded.role
    };

    const newAccessToken = signAccessToken(payload);

    return res.json({
      accessToken: newAccessToken
    });
  } catch (err) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
};
