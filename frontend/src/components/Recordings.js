import React, { useState, useEffect } from 'react';
import { Box, IconButton, Grid, Heading, Spacer, Text } from '@chakra-ui/react';
import { MdPlayCircleFilled, MdDelete, MdFileDownload } from 'react-icons/md';
import axios from 'axios';

const Recordings = () => {
  const [recordedVideos, setRecordedVideos] = useState([]);

  const fetchCameraIds = async () => {
    try {  
      // Retrieve userId from localStorage
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.id) {
        throw new Error('User data or user ID not found in localStorage');
      }
      const userId = userData.id;
  
      // Make a GET request to fetch assigned cameras for the user
      const assignedCamerasResponse = await axios.get(`http://localhost:3002/cameras/assigned/${userId}`);
  
      // Extract cameraIds from the response
      const assignedCameras = assignedCamerasResponse.data;
      const cameraIds = assignedCameras.map((camera) => camera._id);
  
      return cameraIds;
    } catch (error) {
      console.error('Error fetching cameraIds:', error);
      throw error;
    }
  };

  const fetchVideosByCameraIds = async (cameraIds) => {
    try {  
      // Make a POST request to fetch videos based on cameraIds
      const videosResponse = await axios.post('http://localhost:3003/videos/videosByCameraIds', {
        cameraIds,
      });
  
      const videos = videosResponse.data;  
      return videos;
    } catch (error) {
      console.error('Error fetching videos based on cameraIds:', error);
      throw error;
    }
  };

  const downloadVideo = async (videoId) => {
    try {
      const response = await axios.get(`http://localhost:3003/videos/${videoId}/stream`, {
        responseType: 'blob',
      });
      const videoBlob = new Blob([response.data], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(videoBlob);
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `video-${videoId}.mp4`; // Give a meaningful file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading video:', error);
    }
  };

  const fetchCameraIdsAndVideos = async () => {
    try {
      const cameraIds = await fetchCameraIds();
      const videos = await fetchVideosByCameraIds(cameraIds);
  
      setRecordedVideos(videos); // Set the fetched videos to state
    } catch (error) {
      console.error('Error fetching cameraIds and videos:', error);
      // Handle errors
    }
  };

  const streamVideo = async (videoId) => {
    try {
      const response = await axios.get(`http://localhost:3003/videos/${videoId}/stream`, {
        responseType: 'blob',
      });
  
      const videoBlob = new Blob([response.data], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(videoBlob);
  
      // Open the video URL in a new browser tab
      window.open(videoUrl, '_blank');
    } catch (error) {
      console.error('Error streaming video:', error);
      // Handle errors
    }
  };
  
  

  useEffect(() => {
    fetchCameraIdsAndVideos();
  }, []);

  const handleDeleteClick = async (videoId) => {
    try {
      // Make a DELETE request to delete the video
      await axios.delete(`http://localhost:3003/videos/${videoId}`);

      // Filter out the deleted video from the current videos list
      const updatedVideos = recordedVideos.filter((video) => video._id !== videoId);

      // Update the state with the updated videos list
      setRecordedVideos(updatedVideos);
    } catch (error) {
      console.error('Error deleting video:', error);
      // Handle error, show message, etc.
    }
  };

  return (
    <>
      <Text fontSize="2xl" fontWeight="bold" mb="6">
        Recordings
      </Text>
      <Box h="80vh" overflowY="scroll" p={4}>
        <Grid templateColumns="repeat(auto-fill, minmax(320px, 1fr))" gap={6}>
          {recordedVideos.map((video) => (
            <Box key={video._id}>
              <Box mb={2}>
                <video width="100%" controls>
                  <source src={`http://localhost:3003/video/${video._id}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Box>
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={() => downloadVideo(video._id)}
                  aria-label="Download"
                  icon={<MdFileDownload />}
                  colorScheme="blue"
                  mr={2}
                />
                <IconButton
                  onClick={() => handleDeleteClick(video._id)}
                  aria-label="Delete"
                  icon={<MdDelete />}
                  colorScheme="red"
                  mr={2}
                />
              </Box>
            </Box>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Recordings;