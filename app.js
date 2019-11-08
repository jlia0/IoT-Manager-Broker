var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var SQLQuery = require('./sql.js');
var actions = require('./actions');

var mqtt = require('mqtt');
var url = require('url');

var app = express();




// ---------------------- You can change the topic here ----------------------

var mqtt_url = process.env.CLOUDMQTT_URL || 'mqtt://localhost:1883';
var sensorTopic = process.env.CLOUDMQTT_TOPIC || 'sensor';
var actionTopic = process.env.CLOUDMQTT_TOPIC || 'action';
var client = mqtt.connect(mqtt_url);
client.on('connect', onConnect);


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


/**
 * Event listener for MQTT "connect" event.
 */
function onConnect() {
  // subscribe to a topic
  client.subscribe(sensorTopic,function () {
    client.on('message', onMessage);
  });
  client.subscribe(actionTopic,function () {
    client.on('message', onMessage);
  });

  // publish a message to a topic
  // client.publish(topic, 'my message', function() {
  //   console.log("Message is published");
  //   client.end(); // Close the connection when published
  // });

}

/**
 * Event listener for MQTT "Message" event.
 */

function onMessage(topic, message, packet) {
  if (topic === "sensor") {
    console.log("Received '" + message + "' on '" + topic + "'");
    actions.addMessage(message, topic);
    console.log("Added message to database");
  }
  else if (topic === "action") {
    console.log("Action Received '" + message + "' on '" + topic + "'");
    actions.addMessage(message, topic);
    console.log("Added action to database");
  }


}

module.exports = app;
