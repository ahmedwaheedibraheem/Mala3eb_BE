var express = require('express');
var router = express.Router();
const createError = require('http-errors');

var Player = require('../models/player');
var User = require('../models/user');
const authenticationMiddWare = require('../middleware/authentication');

router.use(authenticationMiddWare);

//getPlayer
router.get('/', async (req, res, next) => {
    try {
        let player = await Player.find({ _id: req.user.playerId });
        res.send(player);
    }
    catch (error) {
        next(createError(400, error))
    }
})

//addPlayer
router.post('/add', async (req, res, next) => {
    try {
        const obj = {};
        let arr = ["name", "favNum", "age", "mobileNo", "governerate", "city"];
        arr.forEach(field => {
            if (req.body[field]) {
                obj[field] = req.body[field];
            }
        })
        const newPlayer = new Player(obj);
        let addedPlayer = await newPlayer.save();
        await User.findByIdAndUpdate(req.user._id, { playerId: addedPlayer._id });
        res.send(addedPlayer)
    } catch (error) {
        next(createError(400, error));
    }
});

//updatePlayerImage
// router.patch('/img', async (req, res, next) => {
//     try {
//         const {imgURL} = req.body;
//         let editedPlayer = await Player.findByIdAndUpdate(req.user.playerId, req.body,{new:true});
//         res.send(editedPlayer);
//     }
//     catch (error) {
//         next(createError(400, error))
//     }
// });

//updatePlayerData
router.patch('/data', async (req, res, next) => {
    try {
        const obj = {};
        let arr = ["name", "favNum", "age", "mobileNo", "governerate", "city"];
        arr.forEach(field => {
            if (req.body[field]) {
                obj[field] = req.body[field];
            }
        })
        let playerAfterEdit = await Player.findByIdAndUpdate(req.user.playerId, obj);
        res.send(playerAfterEdit);
    }
    catch (error) {
        next(createError(400, error))
    }
});

//deletePlayer
router.delete('/', async (req, res, next) => {
    try {
        let player = await Player.find({ _id: req.user.playerId });
        if (!player) return next(createError(404, error));
        let deletedPlayer = await Player.deleteOne({ _id: req.user.playerId });
        await User.deleteOne({ playerId: req.user.playerId });
        res.send(deletedPlayer);
    }
    catch (error) {
        next(createError(400, error))
    }
})

// Exports
module.exports = router;
