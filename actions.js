var SQLQuery = require('./sql.js');

module.exports = function () {

};

// skeleton function for broker ID
module.exports.getBrokerID = function(callback){
    var status = -1;
    var query = "SELECT * FROM public.broker;";
    SQLQuery(query, function (err, res) {
        if (err) {
            status = 0;
            callback(status);
        }
        else {
            status = 1;
            return res;
        }
    });
};

// Add the message received from client and store it on the database
module.exports.addMessage = function(message, sensor, callback) {
  var status = -1;
  var query = "INSERT INTO public.sensor (message, topic) VALUES ('" + message + "', '" + sensor + "');";
  SQLQuery(query, function (err, res) {
    if (err) {
      status = 0;
      callback(status);
    }
    else {
      status = 1;
    }
  });
};