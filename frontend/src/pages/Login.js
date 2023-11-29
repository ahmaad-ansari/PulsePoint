import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack, useToast, Center, Link, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const toast = useToast();
  
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Make API request to your login endpoint
        const API_BASE_URL_USER = 'http://localhost:3001/users';

        try {
          const response = await fetch(`${API_BASE_URL_USER}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });
    
          if (response.ok) {
            const data = await response.json();
            console.log(data);
    
            // Save user data and token in localStorage or sessionStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify({
              id: data._id,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              username: data.username,
            }));
    
            // Display success message and navigate to dashboard or home page
            toast({
              title: 'Login successful.',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            navigate('/dashboard');
          } else {
            const errorData = await response.json();
            // Display error message
            toast({
              title: errorData.message || 'Login failed.',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        } catch (error) {
          // Handle network or server errors
          toast({
            title: 'Login failed.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      };

  return (
    <Center minH="100vh" bg="gray.900">
      <Box maxW="md" mx="auto" p={4} borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="gray.800" color="white">
        <Heading as="h2" size="lg" textAlign="center" mb={4}>
          PulsePoint
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4} p={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg="gray.700"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                minW="300px" // Set minimum width here (adjust as needed)
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="gray.700"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                minW="300px" // Set minimum width here (adjust as needed)
              />
            </FormControl>
            <Link fontSize="sm" color="blue.400" href='/register'>
              Don't have an account? Register
            </Link>
            <Button colorScheme="blue" variant="solid" type="submit">
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    </Center>
  );
};

export default LoginPage;
