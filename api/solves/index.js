const connectDB = require("../../lib/db");
const Solve = require("../../models/Solve");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const user = jwt.verify(token, process.env.JWT_SECRET);

      const { time, cubeType } = req.body;

      const solve = await Solve.create({
        userId: user.id,
        time,
        cubeType
      });

      return res.json(solve);
    } catch {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  if (req.method === "GET") {
    const solves = await Solve.find().sort({ createdAt: -1 });
    res.json(solves);
  }
};