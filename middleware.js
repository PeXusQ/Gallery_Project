const jwt = require('jsonwebtoken');
const config = require('./config');

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, config.jwt.secret, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// CSRF protection middleware
const csrfProtection = (req, res, next) => {
    const token = req.headers['x-csrf-token'];
    const sessionToken = req.session?.csrfToken;
    
    if (!token || !sessionToken || token !== sessionToken) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    next();
};

// Rate limiting middleware
const rateLimit = require('express-rate-limit');

const createRateLimit = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: { error: message },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// Login rate limiting
const loginLimiter = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5, // 5 attempts
    'Too many login attempts, please try again later'
);

// Upload rate limiting
const uploadLimiter = createRateLimit(
    60 * 1000, // 1 minute
    10, // 10 uploads per minute
    'Too many uploads, please slow down'
);

module.exports = {
    authenticateToken,
    csrfProtection,
    loginLimiter,
    uploadLimiter
};
