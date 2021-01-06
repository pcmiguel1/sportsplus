var express = require('express');
var router = express.Router();
var usersModel = require('../Models/usersModel');

router.get('/', async function(req, res, next) {
    let result = await usersModel.getAllUsers();
    res.status(result.status).send(result.data);
});

router.get('/:pos', async function(req, res, next) {
    let pos = req.params.pos;
    let result = await usersModel.getUser(pos);
    res.status(result.status).send(result.data);
});

router.get('/:pos/events', async function(req, res, next) {
    let pos = req.params.pos;
    let result = await usersModel.getUserEvents(pos);
    res.status(result.status).send(result.data);
});

router.post('/', async function(req, res, next) {
    let user = req.body;
    let result = await usersModel.createUser(user);
    res.status(result.status).send(result.data);
});

module.exports = router;

