const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Helper function to generate a JWT
const generateToken = (userId, name, role) => {
    // Uses the JWT_SECRET from the .env file
    return jwt.sign({ userId, name, role }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
    });
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // 1. Find the user by username
    const user = await User.findOne({ username });

    // 2. Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
        // Successful login: Return user data and the token
        res.json({
            userId: user._id,
            name: user.name,
            username: user.username,
            role: user.role,
            token: generateToken(user._id, user.name, user.role),
        });
    } else {
        // Failed login
        res.status(401).json({ message: 'Invalid username or password' });
    }
}); // <-- End of the /login route

// @route   POST /api/auth/register
// @desc    Register a new student user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, username, password } = req.body;

    try {
        // 1. Check if user already exists
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).json({ message: 'User with that ID already exists' });
        }

        // 2. Create the new user (password is hashed in the model middleware)
        const user = await User.create({
            name,
            username,
            password,
            role: 'student'
        });

        // 3. Respond with success and the JWT token (logs user in immediately)
        if (user) {
            res.status(201).json({
                userId: user._id,
                name: user.name,
                username: user.username,
                role: user.role,
                token: generateToken(user._id, user.name, user.role),
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
}); // <-- End of the /register route

module.exports = router;
