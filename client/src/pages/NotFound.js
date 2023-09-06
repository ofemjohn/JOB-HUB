import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: '50px',
        position: 'relative', // Add this line
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        minHeight="calc(100vh - 64px)" // Subtract the height of the footer (64px in this case)
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
          sx={{
            textDecoration: 'none',
            marginTop: '2px',
            backgroundColor: '#125469',
            '&:hover': { backgroundColor: '#1C8FB4' },
            width: '500px',
          }}
        >
          Go to Home
        </Button>
      </Box>
      {/* Footer */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        p="16px" // Add some padding for spacing
        textAlign="center"
      >
      </Box>
    </Container>
  );
};

export default NotFound;
