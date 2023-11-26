const express = require('express');
const Camera = require('../models/camera');

const router = express.Router();

// Add a new camera
router.post('/', async (req, res) => {
    const { ipAddress, ...cameraData } = req.body;
    try {
        let camera = await Camera.findOneAndUpdate({ ipAddress }, cameraData, { new: true, upsert: true });
        res.status(201).json(camera);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all cameras
router.get('/', async (req, res) => {
  try {
    const cameras = await Camera.find();
    res.status(200).json(cameras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a camera
router.patch('/:id', async (req, res) => {
  try {
    const camera = await Camera.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!camera) {
      return res.status(404).json({ error: 'Camera not found' });
    }
    res.status(200).json(camera);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a camera
router.delete('/:id', async (req, res) => {
  try {
    const camera = await Camera.findByIdAndDelete(req.params.id);
    if (!camera) {
      return res.status(404).json({ error: 'Camera not found' });
    }
    res.json(camera);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
