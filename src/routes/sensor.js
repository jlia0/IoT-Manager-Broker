const express = require('express');
const { Sensor } = require('../db/models');

const router = express.Router();

// Fetch all data (meh)
router.get('/', async (req, res) => {
  try {
    const sensorData = await Sensor.find().exec();
    res.send(sensorData);
  } catch (err) {
    res.status = 500;
    res.send({ error: err.message });
  }
});

// Fetch data for device with :search
// e.g. localhost:3000/sensor/1
//      localhost:3000/sensor/weather
router.get('/:search', (req, res) => {
  // get the id from the url
  const { search } = req.params;

  if (!Number.isNaN(search)) {
    // search by id
  } else {
    // search by device
  }

  const dummy = search;
  res.send({ dummy });
});

// Save sensor data
// router.post('/', (req, res) => {});

module.exports = router;
