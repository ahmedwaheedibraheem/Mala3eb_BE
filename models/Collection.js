// comment
const mongoose = require('mongoose');
const validator = require('validator');

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
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
    address: {
        type: String,
        required: true,
        maxlength: 250
    },
    players: {
        type: [String]
    },
    numberOfPlayers: {
        type: String
    }
},
    {
        collection: 'collections',
        toJSON: {
            hidden: ['__v'],
            transform: true
        }
    });

const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;