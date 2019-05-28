var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var cors = require('cors');
const cookieParser = require('cookie-parser');


const userRouter = require('./routes/user');
const playerRouter = require('./routes/player');
const commentRouter = require('./routes/comment');
const pitchRouter = require('./routes/pitch');

require('./db');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Routes

app.use('/user', userRouter);
app.use('/player',playerRouter);
app.use('/comments',commentRouter);
app.use('/pitch', pitchRouter);


// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.send(err);
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  } else
    next(err);
});

module.exports = app;
