import React, { useState } from 'react';
import Box from '@mui/material/Box';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';


const LoginPage = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);

  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  return (
    <Box
      sx={{
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '50px',
        marginTop: '50px',
        height: '80vh',
        bgcolor: '#f0f0f0',
        sx: 'auto',
      }}
    >
      <Box>
        {showLoginForm ? (
          <>
            <LoginForm />
            <Typography variant='body1' >
              Don't have an account?{' '}
              <Button  size="small" variant="outlined" onClick={toggleForm} sx={{}} >Sign Up</Button>
            </Typography>
          </>
        ) : (
          <>
            <RegisterForm />
            <Typography variant='body1'>
              Already have an account?{' '}
              <Button  size="small" variant="outlined" onClick={toggleForm} sx={{}} >Login</Button>
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default LoginPage;
