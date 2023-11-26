const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
  name:  { type: String, required: true},
  ipAddress:  { type: String, required: true},
  location:  { type: String, required: true},

  streamURL:  { type: String, required: true}
});

module.exports = mongoose.model('Camera', cameraSchema);
