require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const videoRoutes = require('./routes/videos');
const morgan = require('morgan'); // Adding Morgan for logging


const app = express();
const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI;

// Logging middleware setup using Morgan
app.use(morgan('dev'));

app.use(cors());
app.use(express.json());
app.use('/videos', videoRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to PulsePoint Video Storage Service');
});

app.use('/storage', express.static('storage'));

mongoose.connect(MONGO_URI, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });