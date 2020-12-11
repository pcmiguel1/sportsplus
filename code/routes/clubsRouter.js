var express = require('express');
var router = express.Router();
var clubsModel = require('../Models/clubsModel');

router.get('/', async function(req, res, next) {
    let result = await clubsModel.getAllClubs();
    res.status(result.status).send(result.data);
});

router.get('/:pos', async function(req, res, next) {
    let pos = req.params.pos;
    let result = await clubsModel.getClub(pos);
    res.status(result.status).send(result.data);
});

module.exports = router;

