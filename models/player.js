//player
const mongoose = require('mongoose');
const validator = require('validator');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 20,
        required: true
    },
    favNum: {
        type: Number,
        min: 1,
        maximum: 99,
        required: true
    },
    imgURL: {
        type: String,
        validate: validator.isURL
    },
    age: {
        type: Number,
        min: 6,
        maximum: 99,
        required: true
    },
    mobileNo: {
        type: String,
        validate: validator.isMobilePhone,
        required: true
    },
    governerate: {  // search
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    positions: {
        type: [String],
        maxlength: 3, // search
        required: true
    },
    skills: {
        pass: {
            type: Number,
            min: 0
        },
        shoot: {
            type: Number,
            min: 0
        },
        dribble: {
            type: Number,
            min: 0
        },
        fitness: {
            type: Number,
            min: 0
        },
        speed: {
            type: Number,
            min: 0
        }
    },
    evaluatores: {
        type: Number,
        min: 0,
        default: 0
    },
    teamId: {
        type: Array
    },
    collectionsEnrolled: {
        type: [Number]
    },
    followers: {
        type: [Number]
    },
    following: {
        type: [Number]
    },
    commentIds: {
        type: [Number]
    },
    favPitchs: {
        type: [Number]
    },
    collectionsCreated: {
        type: [Number]
    }
},
    {
        collection: 'players',
        toJSON: {
            hidden: ['__v'],
            transform: true
        }
    });
    
// Creating player model
const Player = mongoose.model('Player', playerSchema)

module.exports = Player;