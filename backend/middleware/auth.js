const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT and protect routes
const protect = async (req, res, next) => {
    let token;

    // Check for "Bearer <token>" in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token (remove "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from database (excluding password) and attach to request object
            req.user = await User.findById(decoded.userId).select('-password');
            
            if (!req.user) {
                 return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Proceed to the next middleware or route handler

        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// Middleware to verify that the user is an Admin
const admin = (req, res, next) => {
    // This assumes the 'protect' middleware has already run and attached req.user
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden, not authorized as an admin' });
    }
};

module.exports = { protect, admin };
