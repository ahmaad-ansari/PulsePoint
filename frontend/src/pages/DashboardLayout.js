import React, { useState, useEffect, useRef } from 'react';
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
import { FaHome, FaCamera, FaSignOutAlt, FaPlus, FaEye, FaFolder } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CameraManage from '../components/CameraManage'; // Replace with the actual path to your Home component
import CameraView from '../components/CameraView'; // Replace with the actual path to your AddCamera component
import Dashboard from '../components/Dashboard';
import Recordings from '../components/Recordings';

const DashboardLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // Set 'dashboard' as the default active tab
  const navigate = useNavigate();
  const firstTabRef = useRef(null); // Reference to the first tab

  const tabs = [
    { name: 'dashboard', label: 'Dashboard', icon: FaEye },
    { name: 'manageCamera', label: 'My Cameras', icon: FaCamera },
    { name: 'addCamera', label: 'Add Cameras', icon: FaPlus },
    { name: 'record', label: 'Recordings', icon: FaFolder },
    // Add other tabs here using icons from react-icons
  ];

  const tabComponents = {
    dashboard: <Dashboard />,
    manageCamera: <CameraManage />,
    addCamera: <CameraView />,
    record: <Recordings />,
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

  useEffect(() => {
    // Trigger a click event on the first tab when the component mounts
    if (firstTabRef.current) {
      firstTabRef.current.click();
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

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
        {tabs.map((tab, index) => (
          <Flex
            key={tab.name}
            ref={index === 0 ? firstTabRef : null} // Ref added to the first tab
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
