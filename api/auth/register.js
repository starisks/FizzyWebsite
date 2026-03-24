const connectDB = require("../../lib/db");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    const { email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed
    });

    res.json(user);
  }
};