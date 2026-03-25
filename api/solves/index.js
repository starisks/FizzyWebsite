const connectDB = require("../../lib/db");
const auth = require("../../lib/auth");
const mongoose = require("mongoose");

const SolveSchema = new mongoose.Schema({
  userId: String,
  time: Number,
  cubeType: String,
  createdAt: { type: Date, default: Date.now }
});

const Solve = mongoose.models.Solve || mongoose.model("Solve", SolveSchema);

module.exports = async (req, res) => {
  await connectDB();

  const user = auth(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST") {
    const { time, cubeType } = req.body;

    await Solve.create({
      userId: user.id,
      time,
      cubeType
    });

    return res.json({ success: true });
  }

  if (req.method === "GET") {
    const solves = await Solve.find({ userId: user.id }).sort({ createdAt: -1 });

    return res.json(solves);
  }
};