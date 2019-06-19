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
    coverImage: {
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
    address: {
        type: String,
        required: true,
        maxlength: 300
    },
    favPosition: {
        type: String,
        maxlength: 10,
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
        type: [String]
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

playerSchema.method('compute', function () {
    this.skills.pass = this.skills.pass / this.evaluatores;
    this.skills.shoot = this.skills.shoot / this.evaluatores;
    this.skills.dribble = this.skills.dribble / this.evaluatores;
    this.skills.fitness = this.skills.fitness / this.evaluatores;
    this.skills.speed = this.skills.speed / this.evaluatores;
    return this.skills;
});

// Creating player model
const Player = mongoose.model('Player', playerSchema)

module.exports = Player;