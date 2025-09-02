const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    try {
        const decoded = jwt.verify(token, 'secretkey'); // in prod use env var
        req.user = { id: decoded.id, email: decoded.email };
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token invalid' });
    }
};
