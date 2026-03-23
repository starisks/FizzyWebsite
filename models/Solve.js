const mongoose = require("mongoose");

const SolveSchema = new mongoose.Schema({
  userId: String,
  time: Number,
  cubeType: { type: String, default: "3x3" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Solve || mongoose.model("Solve", SolveSchema);