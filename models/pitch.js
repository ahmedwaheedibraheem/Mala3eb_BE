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
        validate: validator.isURL
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
    governerate: {  // search
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    lights: {
        type: Boolean,
        required: true
    },
    pricePerHour: {
        day: {
            type: Number,
            required: true
        },
        night: {
            type: Number
        }
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
        type: Number,
        default: 0,
        min: 0
    },
    showerRoom: {
        type: Number,
        default: 0,
        min: 0
    },
    location: {
        label: {
            type: String,
            required: true
        },
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    imgsURL: {
        type: [String]
    },
    commentIds: {
        type: [String]
    }
},
    {
        collection: 'pitchs',
        toJSON: {
            hidden: ['__v'],
            transform: true
        }
    });