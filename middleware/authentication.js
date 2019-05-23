const User = require('../models/user');
const createError = require('http-errors');

module.exports = async (req,res,next) => {
    try {
        const {authorization: token} = req.headers;
        if(!token) throw new Error('Authentication failed!');
        req.user = await User.getUserByToken(token);
        next();            
    } catch (error) {
        next(createError(401, 'not-authenticated!'))
    }
};