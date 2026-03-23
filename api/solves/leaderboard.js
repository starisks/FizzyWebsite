const Solve = require('../../models/Solve');
const connectDB = require('../../lib/db');

module.exports = async (req, res) => {
    await connectDB();

    const solves =await
    Solve.find().sort({ time: 1 }).limit(10);

    res.json(solves);
};