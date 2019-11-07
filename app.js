var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var SQLQuery = require('./sql.js');

var mqtt = require('mqtt');
var url = require('url');

var app = express();

var mqtt_url = process.env.CLOUDMQTT_URL || 'mqtt://localhost:1883';
var topic = process.env.CLOUDMQTT_TOPIC || 'test';




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var client = mqtt.connect(mqtt_url);

client.on('connect', function() { // When connected

  // subscribe to a topic
  client.subscribe(topic, function() {

  });

  // // publish a message to a topic
  // client.publish(topic, 'my message', function() {
  //   console.log("Message is published");
  //   client.end(); // Close the connection when published
  // });
});

// when a message arrives, do something with it
client.on('message', function(topic, message, packet) {
  console.log("Received '" + message + "' on '" + topic + "'");
});

module.exports = app;
