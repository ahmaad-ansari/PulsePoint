import React, { useState, useEffect } from 'react';
import { Box, Grid, Text, AspectRatio, useToast } from '@chakra-ui/react';

const Dashboard = () => {
  const [cameras, setCameras] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('userData')).id;
        const response = await fetch(`http://localhost:3002/cameras/assigned/${userId}`);

        if (response.ok) {
          const data = await response.json();
          setCameras(data);
        } else {
          throw new Error('Failed to fetch cameras');
        }
      } catch (error) {
        console.error('Error fetching cameras:', error);
        toast({
          title: 'Error',
          description: 'Failed to load camera data.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    };

    fetchCameras();
  }, []);

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb="6">
        Dashboard
      </Text>
      <Grid templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
        {cameras.map(camera => (
          <Box key={camera._id} borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Text p="4" fontWeight="bold">{camera.name}</Text>
            <AspectRatio ratio={16 / 9}>
              <iframe 
                src={camera.streamUrl} 
                title={camera.name} 
                frameBorder="0" 
                allowFullScreen
              />
            </AspectRatio>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
