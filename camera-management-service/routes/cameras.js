const mongoose = require('mongoose');
const express = require('express');
const Camera = require('../models/camera');
const auth = require('../middleware/auth');
const axios = require('axios');


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

// GET route to fetch cameras that the user is not assigned to
router.get('/not-assigned/:userId', async (req, res) => {
  const { userId } = req.params;

  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  try {
    // Find cameras where the userId is not present in assignedUsers
    const camerasNotAssigned = await Camera.find({ assignedUsers: { $nin: [userId] } });
    
    res.status(200).json(camerasNotAssigned);
  } catch (error) {
    console.error('Error fetching cameras not assigned to user:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET route to fetch cameras that the user is assigned to
router.get('/assigned/:userId', async (req, res) => {
  const { userId } = req.params;

  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  try {
    // Find cameras where the userId is present in assignedUsers
    const assignedCameras = await Camera.find({ assignedUsers: userId });
    
    res.status(200).json(assignedCameras);
  } catch (error) {
    console.error('Error fetching cameras assigned to user:', error);
    res.status(500).json({ message: 'Server Error' });
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
router.patch('/:id', auth, async (req, res) => {
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

router.delete('/:cameraId/removeUser/:userId', async (req, res) => {
  const { cameraId, userId } = req.params;

  // Validate cameraId and userId
  if (!mongoose.Types.ObjectId.isValid(cameraId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid cameraId or userId' });
  }

  try {
    // Use $pull to remove the userId from assignedUsers
    const updatedCamera = await Camera.findByIdAndUpdate(cameraId, {
      $pull: { assignedUsers: userId }
    }, { new: true });

    if (!updatedCamera) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    res.status(200).json({ message: 'Camera has been removed', camera: updatedCamera });
  } catch (err) {
    console.error("Error details:", err);
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Delete a camera
router.delete('/:id', auth, async (req, res) => {
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

// POST route to add a single userId to a camera
router.post('/:cameraId/addUser', async (req, res) => {
  const { cameraId } = req.params;
  const { userId } = req.body;

  // Validate cameraId
  if (!mongoose.Types.ObjectId.isValid(cameraId)) {
    return res.status(400).json({ message: 'Invalid cameraId' });
  }

  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  try {
    const camera = await Camera.findById(cameraId);

    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    // Check if the userId already exists in assignedUsers
    if (camera.assignedUsers.includes(userId)) {
      return res.status(400).json({ message: 'User already added to camera' });
    }

    // Add userId to assignedUsers array
    camera.assignedUsers.push(userId);
    await camera.save();

    return res.status(200).json({ message: 'Camera has been added' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Route to access camera stream
router.get('/stream/:cameraId', auth, async (req, res) => {
  try {
    const cameraId = req.params.cameraId;
    
    // Fetch camera information from your database using Mongoose
    const camera = await Camera.findById(cameraId);
    if (!camera) {
      return res.status(404).send('Camera not found');
    }

    // Proxy the request to the actual camera stream
    const streamUrl = camera.streamUrl; // URL of the camera stream
    const response = await axios.get(streamUrl, { responseType: 'stream' });
    
    // Set appropriate headers
    res.setHeader('Content-Type', response.headers['content-type']);

    // Pipe the video stream to the response
    response.data.pipe(res);
  } catch (error) {
    console.error('Stream Error:', error.message);
    res.status(500).send('Error accessing the camera stream');
  }
});

module.exports = router;
