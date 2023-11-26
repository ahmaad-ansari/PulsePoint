import React from 'react';
import { Container, Box, Heading } from '@chakra-ui/react';

const Dashboard = () => {
  return (
    <Container centerContent>
      <Box mt={8} p={8} maxW="md" borderWidth="1px" borderRadius="lg">
        <Heading>Welcome to the Dashboard</Heading>
        {/* Add your dashboard content here */}
      </Box>
    </Container>
  );
};

export default Dashboard;
