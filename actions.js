var SQLQuery = require('./sql.js');

module.exports = function () {

};

// Skeleton function to insert message into DB
module.exports.addMessage = function(message, topic, callback) {

};

// When register, it works like this
//
// register().then().insertUser().then().getUserID().then().createProfile()

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
            return query;
        }
    });
};

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
  return status;
}