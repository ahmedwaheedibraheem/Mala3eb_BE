const express = require("express");
const router = express.Router();
var mongoose = require('mongoose');
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
            'coverImage',
            'mobileNo',
            'address',
            'lights',
            'rate',
            'pitchLength',
            'pitchWidth',
            'changeRoom',
            'showerRoom',
            'imgsURL'];
        arr.forEach(field => {
            if (req.body[field]) {
                pitchObj[field] = req.body[field]
            };
        });
        let specs = {
            lights: 0,
            ground: 0,
            fixtures: 0
        }
        pitchObj['specs'] = specs;
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
        'coverImage',
        'mobileNo',
        'address',
        'lights',
        'rate',
        'nightRate',
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

//list all reservations of the pitch
router.get('/bookings/:pitchId/:dateInput', async (req, res, next) => {
    try {
        let pitch = await Pitch.findOne({ _id: req.params.pitchId });
        if (!pitch) return (next(createError(404, 'NOT FOUND')));
        let BookingsList = pitch.bookings;
        let result = [];
        BookingsList.forEach(element => {
            if (element['date'] === req.params.dateInput) {
                result.push(element);
            }
        })
        res.send(result);
    }
    catch (error) {
        next(createError(400, error))
    }
})

//add reservation to the pitch
router.patch('/bookings/:pitchId', async (req, res, next) => {
    try {
        let id = mongoose.Types.ObjectId();
        console.log(id);
        let pitch = await Pitch.findOne({ _id: req.params.pitchId });
        if (!pitch) return (next(createError(404, 'NOT FOUND')));
        let arr = ['date', 'name', 'from', 'to'];
        let pitchBookings = pitch.bookings;
        let result = true;
        pitchBookings.forEach(element => {
            if (element['date'] === req.body['date']) {
                if (element['from'] === req.body['from']) {
                    result = false;
                }
            }
        });
        if (result === false) return (next(createError(403, 'Reserved')))
        let resObj = {};
        arr.forEach(el => {
            resObj[el] = req.body[el];
        });
        resObj.id = id;
        pitchBookings.push(resObj);
        let updatedPitch = await Pitch.findByIdAndUpdate(req.params.pitchId, { bookings: pitchBookings }, { new: true })
        res.send(updatedPitch);
    }
    catch (error) {
        next(createError(400, error))
    }
})

//delete the reservation
router.delete('/bookings/:pitchId/:bookId', async (req, res, next) => {
    try {
        let pitch = await Pitch.findOne({ _id: req.params.pitchId });
        if (!pitch) return (next(createError(404, 'NOT FOUND')));
        let bookings = pitch.bookings;
        let newBookings = bookings.filter(el => el.id != req.params.bookId);
        let updatedPitch = await Pitch.findByIdAndUpdate(req.params.pitchId,{bookings:newBookings},{new:true});
        res.send(updatedPitch);
    }
    catch (error) {
        next(createError(400, error));
    }

})

//evaluate the pitch specs
router.post('/eval/:pitchId', async (req, res, next) => {
    try {
        let pitch = await Pitch.findOne({ _id: req.params.pitchId });
        if (!pitch) return (next(createError(404, 'NOT FOUND')));
        const { lights, ground, fixtures } = req.body;
        if (!lights || !ground || !fixtures) return next(createError(404, 'NOT FOUND'));
        let obj = { lights, ground, fixtures };
        let specs = pitch.specs;
        const keys = Object.keys(obj);
        keys.forEach(key => {
            obj[key] = specs[key] + obj[key];
        })
        let evalNo = pitch.evaluatores + 1;
        let updatedPitch = await Pitch.findByIdAndUpdate(req.user.pitchId,
            {
                specs: obj,
                evaluatores: evalNo
            },
            { new: true });
        res.send(updatedPitch);
    }
    catch (error) {
        next(createError(400, error));
    }
})

module.exports = router;