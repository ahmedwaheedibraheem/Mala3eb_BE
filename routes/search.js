const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const Player = require("../models/player");
const Pitch = require("../models/pitch");
// const User = require("../models/user");

const authenticationMiddleware = require('../middleware/authentication');

router.use(authenticationMiddleware);


//search by name
router.get('/:searchKey', async (req, res, next) => {
    try {
        if(!req.params.searchKey) return next(createError(404, error));
        let playersMatched = await Player.find({ name: req.params.searchKey });
        let pitchesMatched = await Pitch.find({name:req.params.searchKey});
        res.send({playersMatched,pitchesMatched});
    }
    catch (error) {
        next(createError(400, error))
    }
})

module.exports = router;