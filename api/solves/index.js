const solve = require('../../models/Solve');
const connectDB = require('../../lib/db');
const { requireAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
    await connectDB();

    if (req.method === 'POST') {
        const user = requireAuth(req, res);
        if (!user) return;

        const { time, cubeType} = req.body;

        await Solve.create({
            userId: user.id,
            time,
            cubeType
         });
         return res.json({ message: "Saved"});
    }
    res.status(405).end();
}