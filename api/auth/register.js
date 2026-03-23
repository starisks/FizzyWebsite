const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const connectDB = require('../../lib/db');

module.exports = async (req, res) => {
    await connectDB();

    if (req.method !== 'POST') return
    res.status(405).end();

    const { email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    await User.create({ email, password: hash });

    res.json({ message: "Registered"});
}