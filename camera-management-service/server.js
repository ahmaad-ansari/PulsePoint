// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const cors = require('cors'); // CORS middleware for handling cross-origin requests
const CameraDiscovery = require('./discovery'); // Import CameraDiscovery module for camera detection
const express = require('express'); // Import Express.js framework for handling HTTP requests
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction
const morgan = require('morgan'); // Morgan for logging HTTP requests
const cameraRoutes = require('./routes/cameras'); // Import routes for camera management

// Create an Express application
const app = express();

// Define the port to run the server, default to 3002 if not specified in the environment
const PORT = process.env.PORT || 3002;

// Get MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

// Create an instance of CameraDiscovery class for camera discovery
const discovery = new CameraDiscovery();

// Middleware setup: Morgan for logging requests in development mode
app.use(morgan('dev'));

// Start camera discovery
discovery.startDiscovery();

// Middleware setup: Enable CORS for all routes
app.use(cors());

// Middleware setup: Parse incoming JSON requests
app.use(express.json());

// Define routes for camera management under '/cameras' endpoint
app.use('/cameras', cameraRoutes);

// Default route to confirm the server is running
app.get('/', (req, res) => {
    res.send('Welcome to PulsePoint Camera Management Service');
});

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Start the server on specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
