// comment
const mongoose = require('mongoose');
const validator = require('validator');

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 10
    },
    desc: {
        type: String,
        required: true,
        maxlength: 250
    },
    date: {
        type: Date,
        required: true
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
    players:{
        type:[Number]
    }
},
    {
        collection: 'collections',
        toJSON: {
            hidden: ['__v'],
            transform: true
        }
    });