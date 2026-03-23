const Solve = require("../../models/Solve");
const connectDB = require("../../lib/db");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    await connectDB();

    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const solves = await Solve.find({ userId: decoded.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(solves);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};