const { SQL } = require('../db/sql.js');
const { Sensor } = require('../db/models');

module.exports.getBroker = async () => {
  const query = 'SELECT * FROM public.broker;';

  try {
    const { rows } = await SQL(query);
    return rows;
  } catch (err) {
    console.error(err);
    return `Failed to get broker: ${err.message}`;
  }
};

// Add the message received from client and store it on the database
module.exports.storeData = async (message, sensor) => {
  const query = `INSERT INTO public.sensor (message, topic) VALUES ('${message}', '${sensor}');`;

  try {
    const { rows } = await SQL(query);
    return rows;
  } catch (err) {
    console.error(err);
    return `Failed to store data: ${err.message}`;
  }
};

module.exports.getDevices = async () => {
  const query = 'SELECT device_id FROM public.device';

  try {
    const { rows } = await SQL(query);
    return rows;
  } catch (err) {
    console.error(err);
    return `Failed to get devices: ${err.message}`;
  }
};

module.exports.saveSensorData = async body => {
  const { data, deviceId, topic } = body;

  try {
    // create new entry
    const sensorData = new Sensor({
      data: data.map(e => Number(e)), // ensure that the data is numeric
      deviceId: Number(deviceId),
      topic,
    });

    // save it to the db
    await sensorData.save();
    console.log('data saved to mongo', body);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
