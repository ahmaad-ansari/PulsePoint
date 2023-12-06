const express = require('express');
const multer = require('multer');
const Video = require('../models/video');
const path = require('path');
const fsp = require('fs/promises');
const fs = require('fs');


const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'storage/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.mp4');
    }
});

const upload = multer({ storage: storage });


// POST endpoint to upload video files
router.post('/upload', upload.single('video'), async (req, res) => {
    try {
        const video = new Video({
            filename: req.file.filename,
            cameraId: req.body.cameraId,
            filePath: req.file.path
        });

        // Save the video to the database
        await video.save();

        // Retrieve the list of videos after saving to show the updated list
        const videos = await Video.find();

        res.status(201).send({ uploadedVideo: video, allVideos: videos });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// GET endpoint to list all videos
router.get('/', async (req, res) => {
    const videos = await Video.find();
    res.status(200).send(videos);
});

// GET endpoint to list videos based on cameraIds
router.post('/videosByCameraIds', async (req, res) => {
    try {
      const { cameraIds } = req.body;
  
      // Find videos that match the provided cameraIds
      const videos = await Video.find({ cameraId: { $in: cameraIds } });
  
      res.status(200).send(videos);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  

// GET endpoint to download a specific video
router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).send('Video not found');
        }
        res.sendFile(path.resolve('storage/', video.filename));
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        // Find the video by ID
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).send('Video not found');
        }

        // Delete the file from the file system
        await fsp.unlink(path.resolve('storage/', video.filename));

        // Remove the video from the database
        await Video.findByIdAndDelete(req.params.id);

        // Retrieve the updated list of videos after deletion
        const updatedVideos = await Video.find();

        res.status(200).send({ deletedVideo: video, allVideosAfterDeletion: updatedVideos });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET endpoint to stream a specific video
router.get('/:id/stream', async (req, res) => {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) {
        return res.status(404).send('Video not found');
      }
  
      const pathToFile = video.filePath;
  
      // Check if the file exists using promises
      try {
        await fs.promises.access(pathToFile, fs.constants.F_OK);
      } catch (err) {
        return res.status(404).send('Video file not found');
      }
  
      // Set the appropriate content type for streaming the video
      res.setHeader('Content-Type', 'video/mp4');
  
      // Create a readable stream from the video file and pipe it to the response
      const stream = fs.createReadStream(pathToFile);
      stream.pipe(res);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  



module.exports = router;
