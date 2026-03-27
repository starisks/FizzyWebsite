const connectDB = require("../lib/db");
const Solve = require("../models/Solve");

module.exports = async (req, res) => {
  await connectDB();

  const top = await Solve.find({})
    .sort({ time: 1 })
    .limit(10);

  res.json(top);
};