const { Schema, model } = require('mongoose');
module.exports = model('User', new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // bcrypt hash
  role: { type: String, enum: ['superadmin', 'siteadmin', 'operator', 'viewer'], required: true },
  siteId: String // for siteadmin: the one site they manage
}));
