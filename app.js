/* Load all of the .env config into the app, useful for devlopement */
require('dotenv').config();

// Bring in the rest of the express application
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var browserify = require('browserify-middleware');
var bluebird = require('bluebird')

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var isDevelopment = app.get('env') === 'development';
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'assets'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.use('/javascripts/main.js', browserify(__dirname + '/assets/javascripts/main.js'));
app.use(express.static(path.join(__dirname, 'public')));

// Redis Configuration Setup
var redis = require('redis');
var REDIS_CONNECTION_STRING = process.env.REDIS_URL || 'redis://localhost:6379';
var client = redis.createClient(REDIS_CONNECTION_STRING);
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
global.redis = client;

// email configuration
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var transport = nodemailer.createTransport(sgTransport({
  auth: {
    api_key: process.env.SENDGRID_KEY
  }
}));
var emailer = bluebird.promisifyAll(transport);
global.emailer = emailer;

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (isDevelopment) {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
