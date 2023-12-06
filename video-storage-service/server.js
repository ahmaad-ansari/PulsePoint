// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const videoRoutes = require('./routes/videos');
const morgan = require('morgan'); // Adding Morgan for logging
const Video = require('./models/video'); // Adjust the path to where your Video model is located

const fs = require('fs');
const path = require('path');

// Create an Express application instance
const app = express();
const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI;

// Logging middleware setup using Morgan
app.use(morgan('dev'));

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming JSON data
app.use(express.json());

// Define routes for video handling
app.use('/videos', videoRoutes);

// Default route to welcome message
app.get('/', (req, res) => {
    res.send('Welcome to PulsePoint Video Storage Service');
});

// Serve static files from the 'storage' directory
app.use('/storage', express.static('storage'));

// Connect to MongoDB
mongoose.connect(MONGO_URI, {}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

// Route to stream a specific video
app.get('/video/:videoId', async (req, res) => {
    // Handling streaming of a specific video file
});

// Start the server and listen on specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
