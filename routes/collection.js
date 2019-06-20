const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const mongoose = require('mongoose');
const Collection = require("../models/Collection");
const User = require("../models/user");
const Player = require("../models/player");

const authenticationMiddleware = require('../middleware/authentication')

router.use(authenticationMiddleware);

//get all collections
router.get("/", async (req, res, next) => {
    try {
        await Collection.find({}, function (err, collections) {
            res.send(collections);
        })
    }
    catch (error) {
        next(createError(400, error));
    }
})

//get collection by id
router.get("/:collectionId", async (req, res, next) => {
    try {
        const collection = await Collection.findOne({ _id: req.params.collectionId });
        res.send(collection);
    }
    catch (error) {
        next(createError(400, error));
    }
})

//create new collection
router.post("/", async (req, res, next) => {
    try {
        const collectionObj = {};
        const arr = [
            'name',
            'desc',
            'date',
            'address'];
        arr.forEach(field => {
            if (req.body[field]) {
                collectionObj[field] = req.body[field]
            }
        })
        collectionObj['players'] = [];
        const newCollection = new Collection(collectionObj);
        const addedCollection = await newCollection.save();
        const collectionId = [...req.user.collectionId];
        collectionId.push(addedCollection._id);
        const user = await User.findByIdAndUpdate(req.user._id, { collectionId: collectionId }, { new: true })
        res.send({ addedCollection, user });
    } catch (error) {
        next(createError(400, error))
    }
})

//Edit collection
router.patch("/:collectionId", async (req, res, next) => {
    const id = req.params.collectionId;
    const collectionObj = {};
    const collectionArr = [
        'name',
        'desc',
        'date',
        'address',
        'players'
    ];
    collectionArr.forEach(field => {
        if (req.body[field]) {
            collectionObj[field] = req.body[field];
        }
    })
    let collection = await Collection.findByIdAndUpdate(id, collectionObj, { new: true });
    res.send(collection);
})

//delete collection
router.delete("/:collectionId", async (req, res, next) => {
    try {
        //delete the collection from the collection 
        let deletedCollection = await Collection.deleteOne({ _id: req.params.collectionId });
        let collectionArr = req.user.collectionId;
        //delete the collectionID from the collection array in users table
        collectionArr.splice(collectionArr.indexOf(req.params.collectionId), 1);
        await User.findByIdAndUpdate(req.user.id, { collectionId: collectionArr });
        res.send(deletedCollection);
    } catch (error) {
        next(createError(400, error));
    }
})

//get all players in the collection
router.get('/players/:collectionId', async (req, res, next) => {
    try {
        let collection = await Collection.findOne({ _id: req.params.collectionId });
        if (!collection) return next(createError(404, 'NOT FOUND'));
        res.send(collection.players)
    }
    catch (error) {
        next(createError(400, error));
    }
})

//add player to collection (myself)
router.post('/players/:collectionId', async (req, res, next) => {
    try {
        //check if there is a collection by this id
        let collection = await Collection.findById({ _id: req.params.collectionId });
        if (!collection) return next(createError(404, 'NOT Found'));
        let joinedPlayers = [...collection.players];
        //check if the player is in the collection
        let player = joinedPlayers.includes(req.user.playerId);
        if (player) return next(createError(400, "Already In This Collection"));
        //adding the player
        joinedPlayers.push(req.user.playerId);
        let updatedCollection = await Collection.findByIdAndUpdate(req.params.collectionId, { players: joinedPlayers }, { new: true });
        res.send(updatedCollection);
    } catch (error) {
        next(createError(400, error))
    }
})

//add another player to the collection
router.post('/players/:collectionId/:playerId', async (req, res, next) => {
    try {
        //check if there is a collection by this id
        let collection = await Collection.findById({ _id: req.params.collectionId });
        if (!collection) return next(createError(404, 'NOT Found'));
        //check if there is a player by this id
        let checkPlayer = await Player.findById({ _id: req.params.playerId });
        if (!checkPlayer) return next(createError(404, 'Not Found!'));
        //check if the current user owns the current collection
        let collectionsForCurrUser = [...req.user.collectionId];
        let result = collectionsForCurrUser.includes(req.params.collectionId);
        if (!result) return next(createError(400, 'You are Not allowed to do that !'));
        let joinedPlayers = [...collection.players];
        //checks if the player we want to add is already inside the collection 
        let player = joinedPlayers.includes(req.params.playerId);
        if (player) return next(createError(400, "Already In This Collection"));
        //adding the player
        joinedPlayers.push(req.params.playerId);
        let updatedCollection = await Collection.findByIdAndUpdate(req.params.collectionId, { players: joinedPlayers }, { new: true });
        res.send(updatedCollection);
    } catch (error) {
        next(createError(400, error));
    }
})

//remove player from collection (myself)
router.delete('/players/:collectionId', async (req, res, next) => {
    try {
        //check if there is a collection by this id
        let collection = await Collection.findById({ _id: req.params.collectionId });
        if (!collection) return next(createError(404, 'NOT Found'));
        //chesk if the player is in the collection 
        let joinedPlayers = [...collection.players];
        let player = joinedPlayers.includes(req.user.playerId);
        if (!player) return next(createError(404, `Player Doesn't Exist In That Collection`));
        //remove the player
        let playerIndex = joinedPlayers.findIndex(el => el === req.user.playerId);
        joinedPlayers.splice(playerIndex, 1);
        let updatedCollection = await Collection.findByIdAndUpdate(req.params.collectionId, { players: joinedPlayers }, { new: true });
        res.send(updatedCollection);
    } catch (error) {
        next(createError(400, error));
    }
})

//remove another player from collection
router.delete('/players/:collectionId/:playerId', async (req, res, next) => {
    try {
        //check if there is a collection by this id
        let collection = await Collection.findById({ _id: req.params.collectionId });
        if (!collection) return next(createError(404, 'NOT Found'));
        //check if there is a player by this id
        let checkPlayer = await Player.findById({ _id: req.params.playerId });
        if (!checkPlayer) return next(createError(404, 'Not Found!'));
        //check if the current user owns the current collection
        let collectionsForCurrUser = [...req.user.collectionId];
        let result = collectionsForCurrUser.includes(req.params.collectionId);
        if (!result) return next(createError(400, 'You are Not allowed to do that !'));
        let joinedPlayers = [...collection.players];
        //check if there is a player byy this id in this collection
        let player = joinedPlayers.includes(req.params.playerId);
        if (!player) return next(createError(404, `Player Doesn't Exist In That Collection`));
        let playerIndex = joinedPlayers.findIndex(el => el === req.params.playerId);
        //removing the player 
        joinedPlayers.splice(playerIndex, 1);
        let updatedCollection = await Collection.findByIdAndUpdate(req.params.collectionId, { players: joinedPlayers }, { new: true });
        res.send(updatedCollection);
    } catch (error) {
        next(createError(400, error));
    }
})

module.exports = router;