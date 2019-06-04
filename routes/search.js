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
        // const searchKey = req.params.name;
        console.log(req.params);

        let playersMatched = await Player.find({ name: req.params.searchKey });
        let pitchesMatched = await Pitch.find({name:req.params.searchKey});

        res.send({playersMatched,pitchesMatched});
    }
    catch (error) {
        next(createError(400, error))
    }
})

module.exports = router;