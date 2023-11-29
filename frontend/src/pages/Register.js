import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack, useToast, Center, Link, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const API_BASE_URL_USER = 'http://localhost:3001/users';

    try {
      const response = await fetch(`${API_BASE_URL_USER}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, username, email, password }),
      });

      if (response.ok) {
        toast({
          title: 'Registered successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        const data = await response.json();
        toast({
          title: data.message || 'Registration failed.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Registration failed.',
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
          Register
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4} p={4}>
            <FormControl isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                bg="gray.700"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                minW="300px"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                bg="gray.700"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                minW="300px"
              />
            </FormControl>
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
                minW="300px"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="gray.700"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                minW="300px"
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
                minW="300px"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                bg="gray.700"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                minW="300px"
              />
            </FormControl>
            <Link fontSize="sm" color="blue.400" href='/login'>
              Already have an account? Login
            </Link>
            <Button colorScheme="blue" variant="solid" type="submit">
              Register
            </Button>
          </Stack>
        </form>
      </Box>
    </Center>
  );
};

export default RegisterPage;
