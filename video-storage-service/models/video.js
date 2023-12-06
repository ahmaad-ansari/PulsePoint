// Import Mongoose for MongoDB interaction
const mongoose = require('mongoose');

// Define the video schema
const videoSchema = new mongoose.Schema({
  // Define the properties for the video schema
  cameraId: { type: String, required: true },
  filename: { type: String, required: true },
  filePath: { type: String, required: true }, // File path for video storage
  timestamp: { type: Date, default: Date.now } // Timestamp for video creation
});

// Export the video schema as a Mongoose model named 'Video'
module.exports = mongoose.model('Video', videoSchema);
