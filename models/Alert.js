const { Schema, model } = require('mongoose');
module.exports = model('Alert', new Schema({
  type: String,                              // Over Current, Low Power Factor, Meter Offline...
  meter: String,                             // display name
  siteId: String,
  severity: { type: String, enum: ['Critical', 'Warning'] },
  triggeredAt: { type: Date, default: Date.now },
  acknowledged: { type: Boolean, default: false },
  acknowledgedBy: String
}));
