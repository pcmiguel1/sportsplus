var express = require('express');
var router = express.Router();
var eventsModel = require('../Models/eventsModel');

router.get('/', async function(req, res, next) {
    let result = await eventsModel.getAllEvents();
    res.status(result.status).send(result.data);
});

router.get('/:pos', async function(req, res, next) {
    let pos = req.params.pos;
    let result = await eventsModel.getEvent(pos);
    res.status(result.status).send(result.data);
});

module.exports = router;

