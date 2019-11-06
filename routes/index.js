var express = require('express');
var router = express.Router();
var mqtt = require('mqtt');
var url = require('url');


var mqtt_url = process.env.CLOUDMQTT_URL || 'mqtt://localhost:1883';
var topic = process.env.CLOUDMQTT_TOPIC || 'test';
var client = mqtt.connect(mqtt_url);

client.on('connect', function() { // When connected

  // subscribe to a topic
  client.subscribe(topic, function() {
    // when a message arrives, do something with it
    client.on('message', function(topic, message, packet) {
      console.log("Received '" + message + "' on '" + topic + "'");
    });
  });

  // publish a message to a topic
  client.publish(topic, 'my message', function() {
    console.log("Message is published");
    client.end(); // Close the connection when published
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express TESTING' });
});

module.exports = router;
