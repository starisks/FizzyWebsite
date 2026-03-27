// lib/auth.js
const jwt = require("jsonwebtoken");

module.exports = function (req) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return null;

    const token = auth.split(" ")[1];
    if (!token) return null;

    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch {
    return null;
  }
};