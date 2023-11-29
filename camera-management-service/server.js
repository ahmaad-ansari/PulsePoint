require('dotenv').config();

const cors = require('cors');
const CameraDiscovery = require('./discovery');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan'); // Adding Morgan for logging
const cameraRoutes = require('./routes/cameras');

const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI;
const discovery = new CameraDiscovery();

// Logging middleware setup using Morgan
app.use(morgan('dev'));

discovery.startDiscovery();

app.use(cors());
app.use(express.json());
app.use('/cameras', cameraRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to PulsePoint Camera Management Service');
});

mongoose.connect(MONGO_URI, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });