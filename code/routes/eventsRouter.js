var express = require('express');
var router = express.Router();
var eventsModel = require('../Models/eventsModel');

router.get('/', async function(req, res, next) {
    let filterObj = req.query;
    let result = await eventsModel.getAllEvents(filterObj);
    res.status(result.status).send(result.data);
});

router.get('/:pos', async function(req, res, next) {
    let pos = req.params.pos;
    let result = await eventsModel.getEvent(pos);
    res.status(result.status).send(result.data);
});

router.delete('/:pos', async function(req, res, next) {
    let pos = req.params.pos;
    let result = await eventsModel.deleteEvent(pos);
    res.status(result.status).send(result.data);
});

router.post('/', async function(req, res, next) {
    let event = req.body;
    let result = await eventsModel.createEvent(event);
    res.status(result.status).send(result.data);
});

router.post('/adduserwhitelist', async function(req, res, next) {
    let obj = req.body;
    let result = await eventsModel.addUserWhitelist(obj);
    res.status(result.status).send(result.data);
});

router.put('/', async function(req, res, next) {
    let event = req.body;
    let result = await eventsModel.updateEvent(event);
    res.status(result.status).send(result.data);
});

module.exports = router;

