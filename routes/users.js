const express = require('express');
const SQLQuery = require('../sql.js');

const router = express.Router();
// var Query = require('../actions.js');
// var crypto = require('crypto');
// var Getter = require('../getters.js');
// var Setter = require('../setters.js');
// var md5cryto = crypto.createHash('md5');

router.get('/broker', function(req, res) {
  const query = 'SELECT * FROM broker;';

  SQLQuery(query, (err, sqlres) => {
    if (err) {
      console.error(err);
      res.status(500);
      res.send({ error: 'failed to get broker' });
      return;
    }

    const { rows } = sqlres;
    res.send(rows);
  });
});

router.get('/device', function(req, res) {
  const query = 'SELECT device_id FROM public.device;';

  SQLQuery(query, (err, sqlres) => {
    if (err) {
      console.error(err);
      res.status(500);
      res.send({ error: 'failed to get devices' });
      return;
    }

    const { rows } = sqlres;
    res.send(rows);
  });
});

module.exports = router;
