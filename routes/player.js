var express = require('express');
var router = express.Router();
const createError = require('http-errors');

var Player = require('../models/player');
var User = require('../models/user');
const authenticationMiddWare = require('../middleware/authentication');

router.use(authenticationMiddWare);

//getplayerbyid (another profile)
router.get('/:playerId', async (req, res, next) => {
    try {
        let player = await Player.findOne({ _id: req.params.playerId });
        if (!player) return next(createError(404, error));
        player.compute();
        res.send(player);
    } catch (error) {
        next(createError(400, error))
    }
})

//addEvaluation
router.post('/eval/:playerId', async (req, res, next) => {
    try {
        let player = await Player.findOne({ _id: req.params.playerId });
        if (!player) return (next(createError(403, 'NOT FOUND')));
        const { pass, shoot, dribble, fitness, speed } = req.body;
        if (!pass || !shoot || !dribble || !fitness || !speed) return next(createError(404, "missing parameter"));
        let obj = { pass, shoot, dribble, fitness, speed };
        let skills = player.skills;
        const keys = Object.keys(obj);
        keys.forEach(key => {
            obj[key] = skills[key] + obj[key];
        });
        let evalNo = player.evaluatores + 1;
        let updatedPlayer = await Player.findByIdAndUpdate(req.user.playerId,
            {
                skills: obj,
                evaluatores: evalNo
            },
            { new: true });
        res.send(updatedPlayer);
    }
    catch (error) {
        next(createError(400, error))
    }
})
// follow player 
router.patch('/follow/:playerId', async (req, res, next) => {
    try {

        if (req.user.playerId != req.params.playerId) {
            let player = await Player.findOne({ _id: req.params.playerId });
            let followersArr = [];
            followersArr = player.followers;
            if (!followersArr.filter(el => el === req.user.playerId)) return (createError(400, 'you already follow this player'))
            followersArr.push(await Player.findOne({ _id: req.user.playerId }));
            let Arr1 = await Promise.all(followersArr);


            if (!player) return (next(createError(403, 'NOT FOUND')));
            let playerMe = await Player.findOne({ _id: req.user.playerId });
            let followingArr = [];
            followingArr = playerMe.following;
            followingArr.push(await Player.findOne({ _id: req.params.playerId }));
            let Arr = await Promise.all(followingArr);
            if (!playerMe) return (next(createError(403, 'NOT FOUND')));
            let updatedPlayer = await Player.findByIdAndUpdate(req.params.playerId, { followers: Arr1 }, { new: true });
            let updatedPlayerMe = await Player.findByIdAndUpdate(req.user.playerId, { following: Arr }, { new: true });
            res.send({ updatedPlayer, updatedPlayerMe });
        }
    }

    catch (error) {

        next(createError(400, error))
    }
})
router.patch('/unfollow/:playerId', async (req, res, next) => {
    try {


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
        let arr = ["name", "imgURL", "coverImage", "favNum", "age", "mobileNo", "address", "favPosition"];
        arr.forEach(field => {
            if (req.body[field]) {
                obj[field] = req.body[field];
            }
        })
        let evaluatores = 1;
        let skills = {
            pass: 0,
            shoot: 0,
            dribble: 0,
            fitness: 0,
            speed: 0
        }
        obj.evaluatores = evaluatores;
        obj.skills = skills;
        const newPlayer = new Player(obj);
        let addedPlayer = await newPlayer.save();
        let user = await User.findByIdAndUpdate(req.user._id, { playerId: addedPlayer._id }, { new: true });
        res.send({ addedPlayer, user });
    } catch (error) {
        next(createError(400, error));
    }
});

//EditPlayerData
router.patch('/data', async (req, res, next) => {
    try {
        const obj = {};
        let arr = ["name", "favNum", "age", "mobileNo", "address", "favPosition"];
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