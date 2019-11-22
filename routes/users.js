const express = require('express');
const action = require('../actions.js');

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
