const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  cameraId:  { type: String, required: true},
  filename:  { type: String, required: true},
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
