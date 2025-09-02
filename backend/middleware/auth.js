const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // Expecting "Bearer token"
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'your_jwt_secret_key';
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // decoded should have at least { id, role }
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};
