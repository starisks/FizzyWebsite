const connectDB = require("../../lib/db");
const mongoose = require("mongoose");

const Solve = mongoose.models.Solve;

module.exports = async (req, res) => {
  await connectDB();

  const leaderboard = await Solve.aggregate([
    {
      $group: {
        _id: "$userId",
        bestTime: { $min: "$time" }
      }
    },
    { $sort: { bestTime: 1 } },
    { $limit: 10 }
  ]);

  res.json(leaderboard);
};