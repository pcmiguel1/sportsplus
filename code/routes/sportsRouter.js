var express = require('express');
var router = express.Router();
var sportsModel = require('../Models/sportsModel');

router.get('/', async function(req, res, next) {
    let result = await sportsModel.getAllSports();
    res.status(result.status).send(result.data);
});

router.get('/:pos', async function(req, res, next) {
    let pos = req.params.pos;
    let result = await sportsModel.getSport(pos);
    res.status(result.status).send(result.data);
});

module.exports = router;

