const express = require('express');
const action = require('../actions/actions.js');
const { SQL } = require('../db/sql');

const router = express.Router();

router.get('/device', (req, res) => {
  action
    .getDevices()
    .then(rtn => {
      res.send(rtn);
    })
    .catch(err => {
      console.error(err);
      res.status(500);
      res.send({ error: err });
    });
});

router.post('/device', async (req, res) => {
  try {
    const { deviceId, deviceStatus } = req.body;
    const { rows } = await SQL(`update device set device_status=${deviceStatus} where device_id=${deviceId}`);
    res.status(200).json({ rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/broker', (req, res) => {
  action
    .getBroker()
    .then(rtn => {
      res.send(rtn);
    })
    .catch(err => {
      console.error(err);
      res.status(500);
      res.send({ error: err });
    });
});

module.exports = router;
