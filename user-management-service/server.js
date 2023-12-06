// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan'); // Adding Morgan for logging
const userRoutes = require('./routes/users'); // Import user routes

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001; // Set port or default to 3001
const MONGO_URI = process.env.MONGO_URI; // MongoDB connection URI from environment variables

// Logging middleware setup using Morgan
app.use(morgan('dev'));

// Middleware for handling Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Route handling for user management
app.use('/users', userRoutes);

// Default route returning a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to PulsePoint User Management Service');
});

// Connect to MongoDB database using Mongoose
mongoose.connect(MONGO_URI, {}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
