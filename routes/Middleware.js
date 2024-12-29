const { JWT_SECRET } = require("../config"); // Ensure JWT_SECRET is correctly imported
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ msg: 'No or malformed authorization header' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Received Token:', token);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded Payload:', decoded);
        req.userId = decoded.userId;

        next();
    } catch (err) {
        console.error('JWT verification failed:', err.message);
        return res.status(403).json({ msg: 'Invalid or expired token' });
    }
}

module.exports = authMiddleware;
