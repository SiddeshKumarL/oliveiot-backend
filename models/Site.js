const { Schema, model } = require('mongoose');
module.exports = model('Site', new Schema({
  id: { type: String, unique: true },       // e.g. site-1
  name: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true }));
