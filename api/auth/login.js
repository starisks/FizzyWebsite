const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const connectDB = require('../../lib/db');

module.exports = async (req, res) => {
    await connectDB();

    const { email, password } = req.body;

    const user = await
    User.findone({ email });

    if (!user) return 
    res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return
    res.status(400).json({ error: "Wrong password"});


    const token = jwt.sign(
        {
            id: user_id,
            role: user.role
        },
        process.env.JWT_SECRET,
    );
    res.json({ token });
};