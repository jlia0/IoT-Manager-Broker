const { SQLQuery } = require('./sql.js');

// skeleton function for broker ID
module.exports.getBrokerID = function(callback) {
  let status = -1;
  const query = 'SELECT * FROM public.broker;';
  SQLQuery(query, (err, res) => {
    if (err) {
      status = 0;
      callback(status);
    } else {
      status = 1;
    }

    return res;
  });
};

// Add the message received from client and store it on the database
module.exports.addMessage = function addMessage(message, sensor, callback) {
  let status = -1;
  const query = `INSERT INTO public.sensor (message, topic) VALUES ('${message}', '${sensor}');`;
  SQLQuery(query, err => {
    if (err) {
      status = 0;
      callback(status);
    } else {
      status = 1;
    }
  });
};

module.exports.getDevices = function getDevices(callback) {
  let status = -1;
  const query = 'SELECT device_id FROM public.device';
  SQLQuery(query, err => {
    if (err) {
      status = 0;
      callback(status);
    } else {
      status = 1;
    }
  });
};
