const express = require('express');
const { SQL } = require('../sql.js');

const router = express.Router();

router.get('/device', async (req, res) => {
  const query = 'SELECT device_id FROM public.device;';

  try {
    const { rows } = await SQL(query);
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send({ error: 'failed to get devices' });
  }
});

module.exports = router;
