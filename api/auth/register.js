const connectDB = require("../../lib/db");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashed
    });

    res.status(200).json({ message: "Registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};