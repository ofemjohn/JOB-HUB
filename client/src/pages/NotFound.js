import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container maxWidth="sm" sx={{ marginTop: '50px' }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Typography variant="h1" sx={{ color: '#FF5722', fontSize: '120px' }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '20px' }}>
          Sorry, the page you are looking for does not exist.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          sx={{ textDecoration: 'none' }}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
