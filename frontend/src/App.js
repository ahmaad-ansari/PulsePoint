import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Dashboard from './pages/DashboardLayout';
import { ChakraProvider, Box } from '@chakra-ui/react';

const App = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token != null;
  };

  return (
    <ChakraProvider>
      <Router>
        <Box as="body" overflow="hidden">
          <Routes>
            <Route path="/" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
};

export default App;
