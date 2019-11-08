const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const SQLQuery = require('./sql.js');
const actions = require('./actions');

const mqtt = require('mqtt');
const url = require('url');

const app = express();

// ---------------------- You can change the topic here ----------------------

const mqtt_url = process.env.CLOUDMQTT_URL || 'mqtt://localhost:1883';
const msgTopic = [process.env.CLOUDMQTT_TOPIC || 'sensor', 'action'];
const client = mqtt.connect(mqtt_url);
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
  client.subscribe(msgTopic, function() {
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
  if (topic === 'sensor') {
    console.log("Received '" + message + "' on '" + topic + "'");
    actions.addMessage(message, topic);
    console.log('Added message to database');
  } else if (topic === 'action') {
    console.log("Action Received '" + message + "' on '" + topic + "'");
  }
}

module.exports = app;
