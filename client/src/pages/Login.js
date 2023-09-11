import React, { useState } from 'react';
import Box from '@mui/material/Box';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import Typography from '@mui/material/Typography';
import { Button, Container } from '@mui/material';

const LoginPage = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);

  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  return (
    <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Box sx={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', boxShadow: 2 }}>
        {showLoginForm ? (
          <>
            <LoginForm />
            <Typography variant="body1">
              Don't have an account?{' '}
              <Button size="small" variant="outlined" onClick={toggleForm}>
                Sign Up
              </Button>
            </Typography>
          </>
        ) : (
          <>
            <RegisterForm />
            <Typography variant="body1">
              Already have an account?{' '}
              <Button size="small" variant="outlined" onClick={toggleForm}>
                Login
              </Button>
            </Typography>
          </>
        )}
      </Box>
    </Container>
  );
};

export default LoginPage;
