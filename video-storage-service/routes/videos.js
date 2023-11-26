const express = require('express');
const multer = require('multer');
const Video = require('../models/video');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'storage/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
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


module.exports = router;
