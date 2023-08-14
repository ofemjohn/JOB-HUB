import React from 'react';
import { Typography, Box, Card, CardContent, Button } from '@mui/material';
import AddLocationAltTwoToneIcon from '@mui/icons-material/AddLocationAltTwoTone';
import { useLocation } from 'react-router-dom';
import hero2 from '../assets/hero2.jpg';

const SearchByLocation = () => {
  const location = useLocation();
  const jobListings = location.state?.joblistings || [];

  return (
    <Box sx={{
        margin: '30px',
        maxWidth: '1000px',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundImage: `url(${hero2})`, // Replace with the path to your background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '30px', // Add padding to create space between content and image edges
    }}
    >
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '20px', color: '#5AAD7C' }}>
        Available Job Listings
      </Typography>
      {jobListings.map((job) => (
        <Card key={job.id} sx={{ width: '100%', marginBottom: '20px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '8px', overflow: 'hidden' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#333', marginBottom: '10px', fontSize: '1.25rem', fontWeight: 'bold' }}>
              {job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#1CB447' }}>
              <AddLocationAltTwoToneIcon sx={{ marginRight: '5px' }} />
              {job.location}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: '5px', fontSize: '0.9rem' }}>
              Salary: {job.salary}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold', color: '#333', fontSize: '1rem' }}>
              Description:
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: '#555', lineHeight: 1.6, fontSize: '0.95rem', padding: '8px 0' }}>
              {job.description}
            </Typography>
          </CardContent>
          <Box sx={{ p: 2, borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              Posted on {job.created_at}
            </Typography>
            <Button variant="contained" color="primary" sx={{ height: '40px', backgroundColor: '#125469', '&:hover': { backgroundColor: '#1C8FB4' } }}>
              Apply Now
            </Button>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default SearchByLocation;
