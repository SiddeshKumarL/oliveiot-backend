const { Schema, model } = require('mongoose');
module.exports = model('Report', new Schema({
  date: { type: String, index: true },       // YYYY-MM-DD
  siteId: String,
  meterId: String,
  startIndex: Number,
  endIndex: Number,
  remarks: String
}));
