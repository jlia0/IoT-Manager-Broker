const { Schema, model } = require('mongoose');

const sensorSchema = new Schema({
  topic: {
    type: String,
    required: true,
  },
  data: {
    type: [Schema.Types.Mixed],
    required: true,
  },
  deviceId: {
    type: Number,
    required: true,
  },
});

module.exports = model('sensor', sensorSchema, 'sensor');
