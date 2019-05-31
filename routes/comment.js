const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const CreateError = require('http-errors');
const Player = require('../models/player');
const Pitch = require('../models/pitch');
const User = require('../models/user');

const middelWareAuthentiacted = require('../middleware/authentication');

//use MiddleWare beacause Authentication when user login return token and and userLoged
router.use(middelWareAuthentiacted);

//get all comments of player
router.get('/player/:playerId', async (req, res, next) => {

    try {
        const player = await Player.findById(req.params.playerId);
        const playerComments = player.commentIds;
        console.log(playerComments);
        const comments = [];
        for (let key of playerComments) {
            comments.push(Comment.findById(key));
        }
        let commentsArr = await Promise.all(comments);
        let user = await User.findById(req.user._id);
         res.send({user,commentsArr});
       
    }
    catch (err) {
        return next(CreateError(400, err));
    }

});

// get comments of pitch

router.get('/pitch/:pitchId',async (req,res,next)=>{
    try{

        const pitch = await Pitch.findById({ _id:req.params.pitchId});
        const pitchComments = pitch.commentIds;
        const comments = [];
        for (let key of pitchComments) {
            comments.push(Comment.findById(key))    
        }
         res.send(await Promise.all(comments));
    }
    catch(err){
        return next(CreateError(400,err));
    }
});

//add comment by playerUser

router.post('/player/:id', async (req, res, next) => {
    try {
        const { commentBody } = req.body;
        const commentObj = new Comment({
            userId: req.user._id,
            userFname:req.user.firstname,
            userLname:req.user.lastname,
            commentDate: new Date(),
            commentBody: commentBody
        });
        const commentAdded = await commentObj.save();
        console.log(commentAdded);
        const commentId = commentAdded._id;

        //add commentId in commentIds array at player
        const playerId = req.params.id;
        const playerUser = await Player.findById(playerId);
        let commentIdsArr = [...playerUser.commentIds];
        console.log(commentIdsArr);
        commentIdsArr.push(commentId);
        const newPlayer = await Player.findByIdAndUpdate(playerId, { commentIds: commentIdsArr }, { new: true });
        console.log(playerUser);
        res.send({ commentAdded, newPlayer });
    }
    catch (error) {
        next(CreateError(400, error));
    }
})


// add comment to Pitch 
router.post('/pitch/:pitchId', async (req, res, next) => {
    try {
        const { commentBody } = req.body;
        const commentPitch = new Comment({
            userId: req.user._id,
            userFname:req.user.firstname,
            userLname:req.user.lastname,
            commentDate: new Date(),
            commentBody: commentBody
        });
        const commentAdded = await commentPitch.save();
        const commentId = commentAdded._id;
        const pitch = await Pitch.findById({ _id: req.params.pitchId });
        const commentIdsArr = pitch.commentIds;
        commentIdsArr.push(commentId);

        const pitchUpdated = await Pitch.findByIdAndUpdate(req.params.pitchId, { commentIds: commentIdsArr }, { new: true });
        res.send({ commentAdded, pitchUpdated });

    }

    catch (err) {
        return next(CreateError(400, err));
    }
})

//delete comment from player 
router.delete('/:commentId/:playerId', async (req, res, next) => {
    try {

        let comment = await Comment.findById({ _id: req.params.commentId });
        if (!comment) return next(CreateError(404, error));
        let player = await Player.findById({ _id: req.params.playerId});
        let playerComments = player.commentIds;
        console.log(playerComments);
        let index1 = playerComments.findIndex(el => el === req.params.commentId);

        if (req.user._id && req.user._id == comment.userId) {
            playerComments.splice(index1, 1);
            console.log(playerComments);

            let deletedComment = await Comment.deleteOne({ _id: req.params.commentId });
            let palyerUpdated = await Player.findByIdAndUpdate(req.params.playerId, { commentIds: playerComments }, { new: true })
            res.send({ deletedComment, palyerUpdated });
        }
    }
    catch (err) {
        return next(CreateError(400, err));
    }


});

//Delete comment from pitch

router.delete('/:commentId/:pitchId', async (req, res, next) => {
    try {
        const pitch = await Pitch.findById({ _id: req.params.pitchId });
        const comment = await Comment.findById({ _id: req.params.commentId });
        const pitchComments = pitch.commentIds;
        const index = pitchComments.findIndex(el => el === req.params.commentId);

        if (req.user._id && req.user._id == comment.userId) {
            pitchComments.splice(index, 1);
            const commentDeleted = await Comment.deleteOne({ _id: req.params.commentId });
            const pitchUpdated = await Pitch.findByIdAndUpdate(req.params.pitchId, { commentIds: pitchComments }, { new: true });
            res.send({ commentDeleted, pitchUpdated });
        }
    }
    catch (err) {
        return next(CreateError(400, err));
    }

});


//update comment
router.patch('/:commentId', async (req, res, next) => {
    try {
        let comment = await Comment.findById({ _id: req.params.commentId });
        if (req.user._id == comment.userId) {
            const { commentBody } = req.body;
            let commentDate = new Date();
            let commentUpadted = await Comment.findByIdAndUpdate(req.params.commentId, { commentBody: commentBody, commentDate: commentDate }, { new: true });
            res.send(commentUpadted);
        }
    }
     catch (err) {
        return next(CreateError(400, err));
    }
})



module.exports = router;