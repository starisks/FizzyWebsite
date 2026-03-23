const Solve = require("../../models/Solve");
const connectDB = require("../../lib/db");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    await connectDB();

    if (req.method === "POST") {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { time, cubeType } = req.body;

      const solve = await Solve.create({
        userId: decoded.id,
        time,
        cubeType
      });

      return res.json(solve);
    }

    if (req.method === "GET") {
      const solves = await Solve.find().sort({ time: 1 }).limit(50);
      return res.json(solves);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};