var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var sportsRouter = require('./routes/sportsRouter');
var clubsRouter = require('./routes/clubsRouter');
var eventsRouter = require('./routes/eventsRouter');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/sports', sportsRouter);
app.use('/api/clubs', clubsRouter);
app.use('/api/events', eventsRouter);

module.exports = app;
