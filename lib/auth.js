const jwt = require("jsonwebtoken");

module.exports = function (req) {
  const auth = req.headers.authorization;

  if (!auth) return null;

  const token = auth.split(" ")[1];

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};