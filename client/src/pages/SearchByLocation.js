import React, { useEffect, useState } from 'react';
import { Typography, Box, Card, CardContent, Button, Dialog } from '@mui/material';
import AddLocationAltTwoToneIcon from '@mui/icons-material/AddLocationAltTwoTone';
import { useLocation } from 'react-router-dom';
import hero2 from '../assets/hero2.jpg';
import ApplyJob from '../components/ApplyJob';
import axios from 'axios';
import { useSnackbarContext } from '../components/SnackBarContext';

const SearchByLocation = () => {
  const location = useLocation();
  const jobListings = location.state?.joblistings || [];
  const { showSnackbar } = useSnackbarContext();
  const [showApplyForJob, setShowApplyForJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  // const [jobListing, setJobListing] = useState([]);


  const handleApplyNow = (job) => {
    setSelectedJob(job); // Store the selected job
    setShowApplyForJob(true);
  };

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const response = await axios.get('/api/get_joblistings', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data.success) {
          // setJobListing(response.data.job_listings);
        } else {
          showSnackbar('error', response.data.message);
        }
      } catch (error) {
        showSnackbar('error', error.response?.data?.message || 'Error fetching job listings');
      }
    };

    fetchJobListings();
  }, [showSnackbar]);

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
            <Button  onClick={() => handleApplyNow(job)} variant="contained" color="primary" sx={{ height: '40px', backgroundColor: '#125469', '&:hover': { backgroundColor: '#1C8FB4' } }}>
              Apply Now
            </Button>
          </Box>
        </Card>
      ))}
      <Dialog open={showApplyForJob} onClose={() => setShowApplyForJob(false)} maxWidth="md" fullWidth>
        {selectedJob && (
    <ApplyJob
      job={selectedJob}
      onClose={() => setShowApplyForJob(false)}
      jobListingId={selectedJob.id} // Pass the job ID to ApplyForJob
    />
  )}
</Dialog>
    </Box>
  );
};

export default SearchByLocation;
