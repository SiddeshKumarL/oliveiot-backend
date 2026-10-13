const { Schema, model } = require('mongoose');
module.exports = model('Meter', new Schema({
  meterId: { type: String, unique: true },  // e.g. MTR-101
  name: String,
  siteId: String,
  location: String,
  voltage: Number, current: Number, powerFactor: Number, frequency: Number,
  kwh: Number,
  status: { type: String, enum: ['Online', 'Offline'], default: 'Online' }
}, { timestamps: true }));
