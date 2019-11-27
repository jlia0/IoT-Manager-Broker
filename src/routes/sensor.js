const express = require('express');
const { Sensor } = require('../db/models');
const actions = require('../actions/actions');

const router = express.Router();

// Fetch all data (meh)
router.get('/', async (req, res) => {
  try {
    const sensorData = await Sensor.find();
    res.send(sensorData);
  } catch (err) {
    res.status = 500;
    res.send({ error: err.message });
  }
});

// Fetch data for device with :search
// e.g. localhost:3000/sensor/1
router.get('/:deviceId', async (req, res) => {
  // get the id from the url
  const { deviceId } = req.params;

  if (Number.isNaN(deviceId)) {
    res.status(500).send({ error: 'please provide a valid id' });
  }

  try {
    const sensorData = await Sensor.find({ deviceId: Number(deviceId) });
    res.send(sensorData);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get('/topic/:topic/:deviceId?', async (req, res) => {
  const { topic, deviceId } = req.params;

  const query = {
    topic,
  };

  if (deviceId) {
    if (Number.isNaN(deviceId)) {
      res.status(500).send({ error: 'please provide a valid id' });
    }

    query.deviceId = Number(deviceId);
  }

  try {
    const sensorData = await Sensor.find(query);
    res.send(sensorData);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Save sensor data
router.post('/', async (req, res) => {
  try {
    // save it to the db
    await actions.saveSensorData(req.body);
    res.status(200).json({ saved: true });
  } catch (err) {
    res.status(500).send({ saved: false, error: err.message });
  }
});

module.exports = router;
