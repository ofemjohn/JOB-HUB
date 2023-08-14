import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { Link } from 'react-router-dom';

const UnAuthorized = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <LockIcon sx={{ fontSize: '64px', color: '#f44336' }} />
        <Typography variant="h5" gutterBottom sx={{ mt: 2, color: '#f44336' }}>
          Unauthorized Access
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ textAlign: 'center', mt: 2 }}>
          You need to be logged in or a registered user to perform this action.
        </Typography>
        <Button component={Link} to="/login" variant="contained" color="primary" sx={{ mt: 3, backgroundColor: "#125469", '&:hover': { backgroundColor: '#1C8FB4' }, }}>
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default UnAuthorized;
