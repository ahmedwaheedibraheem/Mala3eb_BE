const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const Pitch = require("../models/pitch");
const User = require("../models/user");

const authenticationMiddleware = require('../middleware/authentication')

// get
router.get("/", async (req, res, next) => {
    try {
        await Pitch.find({}, function (err, pitches) {
            res.send(pitches);
        });
    } catch (error) {
        next(createError(400, error))
    }
});

// get by id
router.get("/:pitchId", async (req, res, next) => {
    try {
        const pitch = await Pitch.findOne({ _id: req.params.pitchId });
        res.send(pitch)
    } catch (error) {
        next(createError(error, 400))
    }
});

router.use(authenticationMiddleware);

// post
router.post("/", async (req, res, next) => {
    try {
        const pitchObj = {};
        const arr = ['name',
            'imgURL',
            'mobileNo',
            'address',
            'lights',
            'rate',
            'pitchLength',
            'pitchWidth',
            'changeRoom',
            'showerRoom'];
        arr.forEach(field => {
            if (req.body[field]) {
                pitchObj[field] = req.body[field]
            };
        });
        const newPitch = new Pitch(pitchObj);
        const addedPitch = await newPitch.save();
        const pitchId = [...req.user.pitchId]
        pitchId.push(addedPitch._id)
        const user = await User.findByIdAndUpdate(req.user._id, { pitchId: pitchId }, { new: true });
        res.send({ addedPitch, user })
    }
    catch (error) {
        next(createError(400, error))
    }
});

// delete
router.delete('/:pitchId', async (req, res, next) => {
    try {
        // delete the pitch itself
        let deletedPitch = await Pitch.deleteOne({ _id: req.user.pitchId });
        // delete pitchID
        let pitch = req.user.pitchId;
        pitch.splice(pitch.indexOf(req.params.pitchId), 1)
        await User.findByIdAndUpdate(req.user.id, { pitchId: pitch });
        res.send(deletedPitch);
    }
    catch (error) {
        next(createError(400, error))
    }
})

// patch
router.patch('/:pitchId', async (req, res, next) => {
    const _id = req.params.pitchId;
    const obj = {};
    const arr = ['name',
        'imgURL',
        'mobileNo',
        'address',
        'lights',
        'rate',
        'pitchLength',
        'pitchWidth',
        'changeRoom',
        'showerRoom'];
    arr.forEach(field => {
        if (req.body[field]) {
            obj[field] = req.body[field]
        }
    })
    let pitch = await Pitch.findByIdAndUpdate(_id, obj, { new: true });
    res.send(pitch);
})

module.exports = router;
