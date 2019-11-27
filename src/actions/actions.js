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

    // Insert new device if it doesn't exist
    // otherwise, update the status to 'true'
    const { rows } = await SQL(`select * from device where device_id = ${deviceId}`);
    if (!rows.length) {
      await SQL(`insert into device values (${deviceId}, true)`);
    } else {
      await SQL(`update device set device_status=true where device_id=${deviceId}`);
    }

    // save it to the db
    await sensorData.save();
    console.log('data saved to mongo', body);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
