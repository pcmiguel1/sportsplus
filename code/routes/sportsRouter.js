var express = require('express');
var router = express.Router();
var sportsModel = require('../models/sportsModel');

router.get('/', async function(req, res, next) {
    let result = await sportsModel.getAllSports();
    res.send(result);
});

router.get('/:pos', async function(req, res, next) {
    let pos = req.params.pos;
    let result = await sportsModel.getSport(pos);
    if (result) res.send(result);
    else res.status(404).send({error:"Sport not found!"});
});

module.exports = router;

