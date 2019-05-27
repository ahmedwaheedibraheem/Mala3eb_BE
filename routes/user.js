const express = require('express');
const router = express.Router();
const createError = require('http-errors');

const User = require('../models/user');

// register
router.post('/register', async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateToken();
        res.send({ token, user });
    } catch (error) {
        next(createError(400, error));
    }
});

// login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        // User not found
        if (!user) throw new Error('Login failed!');
        const match = await user.verifyPassword(password);
        // Password not matched
        if (!match) throw new Error('Login failed!')
        const token = await user.generateToken();
        res.send({ token, user });
    } catch (error) {
        next(createError(400, error));
    }
});

// Exports
module.exports = router;