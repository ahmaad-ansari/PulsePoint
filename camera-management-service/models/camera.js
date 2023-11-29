const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ipAddress: { type: String, required: true },
  location: { type: String, required: true },
  streamUrl: { type: String, required: true },
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Camera', cameraSchema);
