/* eslint-disable no-use-before-define */
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mqtt = require('mqtt');
const mongoose = require('mongoose');

const actions = require('./src/actions/actions');
const { indexRouter, usersRouter, sensorRoute } = require('./src/routes/index');

const app = express();

const mqttUrl = process.env.CLOUDMQTT_URL || 'mqtt://localhost:1883';
const msgTopic = [process.env.CLOUDMQTT_TOPIC || 'sensor', 'action'];
const client = mqtt.connect(mqttUrl);
client.on('connect', onConnect);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sensor', sensorRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Establish MongoDB connection
mongoose.connect(process.env.Mongo_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const mongodb = mongoose.connection;

mongodb.on('error', err => console.error(err));
mongodb.once('open', () => console.log('mongodb: connection established'));

/**
 * Event listener for MQTT "connect" event.
 */
function onConnect() {
  client.publish('broker/connected', 'true');

  client.subscribe(msgTopic, function() {
    client.on('message', onMessage);
  });
}

/**
 * Event listener for MQTT "Message" event.
 */
function onMessage(topic, message, packet) {
  if (topic === 'sensor') {
    console.log(`Received '${message}' on '${topic}'. packet: ${packet}`);
    actions
      .storeData(message, topic)
      .then(() => {
        console.log('Added data to database');
      })
      .catch(err => {
        console.error(err);
      });
  } else if (topic === 'action') {
    console.log(`Action Received '${message}' on '${topic}'`);
  }

  // simple regex to match either:
  // 1. a string: "topic"
  // 2. string with a slash: "topic/somethingelse"
  // if (/([A-Za-z0-9]+$|[A-Za-z0-9]+\/[A-Za-z0-9]+$)/g.test(topic)) {
  // const data = parseMessage(message);
  // }
}

module.exports = app;
