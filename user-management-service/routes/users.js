const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Check if username, password, or email is missing
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, password, and email are required' });
    }

    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(409).json({ message: 'Username already exists' });
      } else {
        return res.status(409).json({ message: 'Email already exists' });
      }
    }

    // Create a new user with first name and last name and save to the database
    const newUser = new User({ username, password, email, firstName, lastName });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: User not found' });
    }

    // Compare passwords using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Check if passwords match
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed: Invalid password' });
    }

    // Generate JWT token for successful login
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Respond with user details, including document ID, and token upon successful login
    const { _id, firstName, lastName, email } = user;
    res.status(200).json({ message: 'Login successful', token, _id, firstName, lastName, email, username });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;