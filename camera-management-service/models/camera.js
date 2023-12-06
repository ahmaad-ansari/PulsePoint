const mongoose = require('mongoose');

// Define the schema for the Camera model
const cameraSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the camera
  ipAddress: { type: String, required: true }, // IP address of the camera
  location: { type: String, required: true }, // Location description of the camera
  streamUrl: { type: String, required: true }, // URL for accessing the camera stream
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array of user IDs assigned to this camera
});

// Export the Camera model using the defined schema
module.exports = mongoose.model('Camera', cameraSchema);
