var express = require('express');
var router = express.Router();
var usersModel = require('../Models/usersModel');

router.get('/', async function(req, res, next) {
    let filterObj = req.query;
    let result = await usersModel.getUser(filterObj);
    res.status(result.status).send(result.data);
});

//Saber os eventos de um certo utilizador
router.get('/:pos/events', async function(req, res, next) {
    let pos = req.params.pos;
    let result = await usersModel.getUserEvents(pos);
    res.status(result.status).send(result.data);
});

//Saber os eventos de um certo utilizador que está a participar
router.get('/:pos/attend', async function(req, res, next) {
    let pos = req.params.pos;
    let result = await usersModel.getUserEventsAttend(pos);
    res.status(result.status).send(result.data);
});

//Saber os eventos de um certo utilizador que já participou
router.get('/:pos/participated', async function(req, res, next) {
    let pos = req.params.pos;
    let result = await usersModel.getUserEventsParticipated(pos);
    res.status(result.status).send(result.data);
});

//Criar um novo utilizador
router.post('/', async function(req, res, next) {
    let user = req.body;
    let result = await usersModel.createUser(user);
    res.status(result.status).send(result.data);
});

//Adcionar utilizador como participante
router.post('/attend', async function(req, res, next) {
    let obj = req.body;
    let result = await usersModel.attendEvent(obj);
    res.status(result.status).send(result.data);
});

module.exports = router;

