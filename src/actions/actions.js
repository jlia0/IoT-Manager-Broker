const { SQL } = require('../db/sql.js');

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
