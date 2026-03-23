const connectDB = require('../../lib/db');
const User = require('../../models/User');
const { requireAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
    await connectDB();

    const user = requireAuth(req, res);
    if (!user) return;

    const data = await
    User.findById(user.id);

    res.json(data);
};