import React, { useEffect, useState } from 'react';
import { Typography, Box, Card, CardContent, Button, Dialog, Container } from '@mui/material';
import AddLocationAltTwoToneIcon from '@mui/icons-material/AddLocationAltTwoTone';
import { useLocation } from 'react-router-dom';
import hero1 from '../assets/hero1.jpg';
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
    <Container maxWidth="lg"> {/* Added Container for responsiveness */}
      <Box
        sx={{
          margin: '30px',
          backgroundImage: `url(${hero1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '30px',
        }}
    >
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '20px', color: '#FFFFFF' }}>
        Available Job Listings
      </Typography>
      {jobListings.map((job) => (
        <Card key={job.id} sx={{ width: '100%', marginBottom: '20px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '8px', overflow: 'hidden' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#212121', marginBottom: '10px', fontSize: '1.25rem', fontWeight: 'bold' }}>
              {job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#1CB447' }}>
              <AddLocationAltTwoToneIcon sx={{ marginRight: '5px' }} />
              {job.location}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: '5px', fontSize: '0.9rem' }}>
              Salary: {job.salary}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: '5px', fontSize: '0.9rem' }}>
              Job-Type: {job.job_type}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: '5px', fontSize: '0.9rem' }}>
              Application_Deadline: {job.application_deadline}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: '5px', fontSize: '0.9rem' }}>
              Experience_Level: {job.experience_level}
            </Typography>
            <Box sx={{border: '1px solid #ccc', padding: 2, marginBottom: 2, display: 'flex', alignItems: 'center', bgcolor: '#E0E9E5',}}>
              <Typography variant="body1" sx={{ mt: 1, color: '#555', lineHeight: 1.6, fontSize: '0.95rem', padding: '8px 0',}}>
              skills_requiredl: <br />{job.skills_required}
            </Typography>
            </Box>
            <Box sx={{border: '1px solid #ccc', padding: 2, marginBottom: 2, display: 'flex', alignItems: 'center', bgcolor: '#E0E9E5',}}>
              <Typography variant="body1" sx={{ mt: 1, color: '#555', lineHeight: 1.6, fontSize: '0.95rem', padding: '8px 0',}}>
               Description: <br />{job.description}
                </Typography>
            </Box>
          </CardContent>
          <Box sx={{ p: 2, borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              Posted on {job.created_at}
            </Typography>
            <Button onClick={() => handleApplyNow(job)} variant="contained" color="primary" sx={{ height: '40px', backgroundColor: '#125469', '&:hover': { backgroundColor: '#1C8FB4' } }}>
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
    </Container>
  );
};

export default SearchByLocation;
