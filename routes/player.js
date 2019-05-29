var express = require('express');
var router = express.Router();
const createError = require('http-errors');

var Player = require('../models/player');
var User = require('../models/user');
const authenticationMiddWare = require('../middleware/authentication');

router.use(authenticationMiddWare);

//getPlayerData
router.get('/getdata', async (req, res, next) => {
    try {
        let player = await Player.findOne({ _id: req.user.playerId });
        player.compute();
        res.send(player);
    }
    catch (error) {
        next(createError(400, error));
    }
})

//addEvaluation
router.post('/eval', async (req, res, next) => {
    try {
        const { pass, shoot, dribble, fitness, speed } = req.body;
        if (!pass || !shoot || !dribble || !fitness || !speed) return next(createError(404, "missing parameter"));
        const obj = { pass, shoot, dribble, fitness, speed };
        let updatedPlayer = await Player.findByIdAndUpdate(req.user.playerId, { skills: obj }, { new: true });
        res.send(updatedPlayer);
    }
    catch (error) {
        next(createError(400, error))
    }
})

//editPlayerImage
router.patch('/img', async (req, res, next) => {
    try {
        const { imgURL } = req.body;
        if (!imgURL) return next(createError(404, error));
        let updatedPlayer = await Player.findByIdAndUpdate(req.user.playerId, { imgURL: imgURL });
        res.send(updatedPlayer);
    }
    catch (error) {
        next(createError(400, error))
    }
});

//addPlayer
router.post('/add', async (req, res, next) => {
    try {
        if (req.user.playerId) {
            return res.send('This user is Already aplayer !');
        }
        const obj = {};
        let arr = ["name", "imgURL", "favNum", "age", "mobileNo", "governerate", "city"];
        arr.forEach(field => {
            if (req.body[field]) {
                obj[field] = req.body[field];
            }
        })
        const newPlayer = new Player(obj);
        let addedPlayer = await newPlayer.save();
        await User.findByIdAndUpdate(req.user._id, { playerId: addedPlayer._id });
        res.send(addedPlayer);
    } catch (error) {
        next(createError(400, error));
    }
});

//EditPlayerData
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
        let updatedUser = await User.findByIdAndUpdate(req.user.id, { playerId: null });
        res.send(deletedPlayer);
    }
    catch (error) {
        next(createError(400, error))
    }
})

// Exports
module.exports = router;
