// user
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');


const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);

// saltRounds, secretKey and tokenExpiry
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
const secretKey = process.env.SECRET_KEY || 'jesuistrescontentdetevoirenegypt';

const tokenExpiry = process.env.TOKEN_EXPIRY || '60m'
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        maxlength: 10,
        required: true
    },
    lastname: {
        type: String,
        maxlength: 10,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: { unique: true },
        validate: validator.isEmail
    },
    playerId: {
        type: String
    },
    pitchId: {
        type: [String]
    }
},
    {
        collection: 'users',
        toJSON: {
            hidden: ['password', '__v'],
            transform: true
        }
    });

// Hidding password and __v
userSchema.options.toJSON.transform = function (doc, ret, options) {
    if (Array.isArray(options.hidden)) {
        options.hidden.forEach(field => {
            delete ret[field];
        });
    };
};

// Adding some methods to the user schema
// verifyPassword
userSchema.method('verifyPassword', function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
});

// generateToken
userSchema.method('generateToken', function () {
    return sign({ _id: this.id }, secretKey, { expiresIn: tokenExpiry });
});

// Adding a static method
// getUserByToken
userSchema.static('getUserByToken', async function (token) {
    const decodedToken = await verify(token, secretKey);
    const user = await User.findById(decodedToken._id);
    if (!user) throw new Error('User not found!');
    return user;
});

// Hashing the password before saving
userSchema.pre('save', async function () {
    if (this.isNew || this.modifiedPaths().includes('password')) {
        this.password = await bcrypt.hash(this.password, saltRounds);
    };
});

// Creating user model
const User = mongoose.model('User', userSchema)

module.exports = User;