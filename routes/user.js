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


// get user by id 

router.get('/:userId', async (req, res, next) => {
    try {
        let user = await User.findOne({ _id: req.params.userId });
        if (!user) return next(createError(404, error));
        res.send(user);
    } catch (error) {
        next(createError(400, error))
    }
})

// get collection ids in the user by token 
router.get('/collection/hamada', async (req, res, next) => {
    try {
        const { authorization: token } = req.headers;
        if (!token) throw new Error('from user route there was no token ');
        user = await User.getUserByToken(token);
        res.send(user.collectionId);
    } catch (error) {
        next(createError(401, 'from user route there was no token'))
    }
})


router.get('/theUser', async (req, res, next) => {
    try {
        const { authorization: token } = req.headers;
        if (!token) throw new Error('from user route there was no token ');
        user = await User.getUserByToken(token);
        res.send(user);
    } catch (error) {
        next(createError(401, 'from user route there was no token'))
    }
})

// Exports
module.exports = router;