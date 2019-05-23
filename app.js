var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');

const userRouter = require('./routes/user');
const playerRouter = require('./routes/player');

require('./db');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/user', userRouter);
app.use('/player', playerRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
