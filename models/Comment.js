// comment

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');


const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userFname:{
        type:String,
        required:true
    },
    userLname:{
        type:String,
        required:true
    },
    commentDate: {
        type: Date,
        required: true
    },
    commentBody: {
        type: String,
        required: true,
        maxlength: 250,
    }
   
},
    {
        collection: 'comments',
        toJSON: {
            hidden: ['__v'],
            transform: true
        }
    });

commentSchema.options.toJSON.transform = function (doc, ret, options) {
    if (Array.isArray(options.hidden)) {
        options.hidden.forEach(field => {
            delete ret[field];
        });
    };
};



const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;