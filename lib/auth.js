const jwt = require('jsonwebtoken');

function getUser(req) {
    try {
        const token = req.headers.authorization;
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
}

function requiredAuth(req, res) {
    const user = getUser(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return null;
    }
    return user;
}

module.exports = { getUser, requiredAuth };