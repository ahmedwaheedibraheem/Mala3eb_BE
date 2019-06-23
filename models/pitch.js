// pitch
const mongoose = require('mongoose');
const validator = require('validator');

const pitchSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 20,
        required: true
    },
    imgURL: {
        type: String,
        validate: validator.isURL,
        required: true
    },
    coverImage: {
        type: String,
        validate: validator.isURL,
    },
    address: {
        type: String,
        maxlength: 300,
        required: true
    },
    evaluatores: {
        type: Number,
        min: 0,
        default: 0
    },
    bookings:{
        type:[Object]
    },
    specs: {
        lights: {
            type: Number,
            min: 0
        },
        ground: {
            type: Number,
            min: 0
        },
        fixtures: {
            type: Number,
            min: 0
        }
    },
    mobileNo: {
        type: String,
        validate: validator.isMobilePhone,
        required: true
    },
    lights: {
        type: Boolean,
    },
    rate: {
        type: Number,
        required: true
    },
    nightRate: {
        type: Number
    },
    pitchLength: {
        type: Number,
        required: true
    },
    pitchWidth: {
        type: Number,
        required: true
    },
    changeRoom: {
        type: Boolean,
    },
    showerRoom: {
        type: Boolean,
    },
    imgsURL: {
        type: [String]
    },
    commentIds: {
        type: [String]
    }
},
    {
        collection: 'pitches',
        toJSON: {
            hidden: ['__v'],
            transform: true
        }
    });

pitchSchema.method('compute', function () {
    this.specs.lights = this.specs.lights / this.evaluatores;
    this.specs.ground = this.specs.ground / this.evaluatores;
    this.specs.fixtures = this.specs.fixtures / this.evaluatores;
    return this.specs;
})

// Hidding __v
pitchSchema.options.toJSON.transform = function (doc, ret, options) {
    if (Array.isArray(options.hidden)) {
        options.hidden.forEach(field => {
            delete ret[field];
        });
    };
};

// Creating pitch model
var pitch = mongoose.model('pitch', pitchSchema)

module.exports = pitch;
