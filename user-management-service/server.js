require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to PulsePoint User Management Service');
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
