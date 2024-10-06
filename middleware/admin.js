const jwt = require('jsonwebtoken');
const { JWT_ADMIN_PASSWORD, JWT_USER_PASSWORD } = require('../config');

function adminMiddleware(req, res, next) {
    const token = req.headers.token;
    const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);

    if (decoded) {
        req.userId = decoded.id;
        next();
    }
    else {
        res.status(403).json({ message: 'Admin not authenticated' });
    }

}

function userMiddleware(req, res, next) {
    const token = req.headers.token;
    const decoded = jwt.verify(token, JWT_USER_PASSWORD);

    if (decoded) {
        req.userId = decoded.id;
        next();
    }
    else {
        res.status(403).json({ message: 'User not authenticated' });
    }

}

module.exports = {
    adminMiddleware: adminMiddleware,
}
