import React, { useState } from 'react';
import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  Spacer,
  Button,
  Heading,
} from '@chakra-ui/react';
import { FaHome, FaCamera, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Home from '../components/Home'; // Replace with the actual path to your Home component
import CameraView from '../components/CameraView'; // Replace with the actual path to your AddCamera component

const DashboardLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  const tabs = [
    { name: 'home', label: 'Home', icon: FaHome },
    { name: 'addCamera', label: 'Add Camera', icon: FaCamera },
    // Add other tabs here using icons from react-icons
  ];

  const tabComponents = {
    home: <Home />,
    addCamera: <CameraView />,
    // Add other components here
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login', { replace: true });
  };

  return (
    <Flex h="100vh">
      <VStack
        w="200px"
        p="5"
        boxShadow="md"
        bg="gray.800"
        color="white"
        align="stretch"
        spacing="2"
      >
        <Heading as="h1" size="md" mb="4">
          PulsePoint
        </Heading>
        {tabs.map(tab => (
          <Flex
            key={tab.name}
            align="center"
            p="3"
            borderRadius="md"
            cursor="pointer"
            bg={activeTab === tab.name ? 'blue.500' : 'transparent'}
            onClick={() => handleTabClick(tab.name)}
            _hover={{ bg: 'gray.600' }}
          >
            <Icon as={tab.icon} />
            <Text ml="2">{tab.label}</Text>
          </Flex>
        ))}
        <Spacer />
        <Button
          variant="outline"
          colorScheme="white"
          leftIcon={<Icon as={FaSignOutAlt} />}
          mb="4"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </VStack>
      <Box flex="1" p="5">
        {tabComponents[activeTab]}
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
