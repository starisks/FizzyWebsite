const connectDB = require("../../lib/db");
const Solve = require("../../models/Solve");

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
    { $limit: 50 }
  ]);

  res.json(leaderboard);
};