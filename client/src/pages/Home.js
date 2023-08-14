import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import banner1 from '../assets/banner1.jpg';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import hero2 from '../assets/hero2.jpg';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import axios from 'axios';
import { useSnackbarContext } from '../components/SnackBarContext';
import PostJob from '../components/PostJob';


export default function Home() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarContext();
  const [showJobForm, setShowJobForm] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [jobListings, setJobListings] = useState([]);


  const handleCreateJob = () => {
    setShowJobForm(true);
  };

  const handleCloseJobForm = () => {
    setShowJobForm(false);
  };

  const handleSearchJobByLocation = async (e) => {
  e.preventDefault();
  try {
    console.log("Location Input:", locationInput);
    const response = await axios.get('/api/joblistings/filter/location', {
      params: {
        location: locationInput,
      },
    });

    console.log("API Response:", response.data);

    if (response.data.success) {
      const jobListingsData = response.data.job_listings;
      console.log("Job Listings Data:", jobListingsData);

      setJobListings(jobListingsData);

      // Navigate to SearchByLocation route with joblistings as state
      navigate('/searchLocation', { state: { joblistings: jobListingsData } });
    } else {
      showSnackbar('error', response.data.message);
    }
  } catch (error) {
    console.error("Error fetching job listings:", error);
    showSnackbar('error', 'Error fetching job listings');
  }
};



  const handleApplyJob = () => {
    navigate('/get_joblistings');
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box
          sx={{
            bgcolor: '#cfe8fc',
            height: '137vh',
            backgroundImage: `url(${banner1})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            overflowX: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            component="form"
            onSubmit={handleSearchJobByLocation}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextField
              sx={{ marginTop: '100px', width: '50%', backgroundColor: 'white' }}
              id="standard-basic"
              label="Search Job By Location"
              variant="filled"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{
                marginTop: '100px',
                width: '10%',
                marginLeft: '5px',
                height: '56px',
                backgroundColor: '#125469',
                '&:hover': { backgroundColor: '#1C8FB4' },
              }}
            >
              Search
            </Button>
          </Box>
          <Grid container spacing={2} sx={{ height: '70vh', marginTop: '400px' }}>
            <Grid item xs={6} sx={{ marginTop: '120px' }}>
              <Box sx={{ padding: '32px' }}>
                <Typography sx={{ color: 'black', marginBottom: '15px' }} variant="h3">
                  Create Job Listings &amp; <br />Find the Perfect Candidates
                </Typography>
                <Typography sx={{ marginLeft: '35px', color: '#1C2ED2', marginBottom: '15px' }} variant="h5">
                  Unlock Your Hiring Potential
                </Typography>
                <Typography sx={{ marginBottom: '15px', color: 'black' }} variant="body1">
                  Are you looking to attract top talent and streamline your hiring process? Look no further! Our job
                  posting platform offers you the perfect opportunity to create job listings and connect with qualified
                  candidates from a diverse range of industries. Ready to take the next step in finding the perfect
                  candidate? Click below to create your job listing and embark on a successful hiring journey.
                </Typography>
                <Button
                  onClick={handleCreateJob}
                  sx={{
                    width: '100%',
                    height: '50px',
                    backgroundColor: '#125469',
                    '&:hover': { backgroundColor: '#1C8FB4' },
                  }}
                  variant="contained"
                >
                  Create a Job Posting
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6} sx={{ position: 'relative', padding: '32px' }}>
              <Box
                sx={{
                  marginTop: '185px',
                  height: '60%',
                  backgroundImage: `url(${hero2})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  filter: 'blur(0px)',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  boxShadow: '0 0 4px 5px rgba(0, 0, 0, 0.7)',
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            bgcolor: '#f5f5f5',
            height: '70vh',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            overflowX: 'hidden',
          }}
        >
          <Box sx={{ padding: '32px' }}>
            <Typography sx={{ textAlign: 'center', marginTop: '150px' }} variant="h1">
              Are you looking for a new challenge?
            </Typography>
            <Typography sx={{ textAlign: 'center', marginTop: '25px', color: '#002278' }} variant="h3">
              Welcome to the gateway of endless possibilities!
            </Typography>
            <Typography sx={{ marginTop: '15px' }} variant="body1">
              If you're craving a thrilling adventure in your career, your search ends here. Get ready to embark on a
              journey of discovery and success, as we present you with an unparalleled array of job opportunities that
              are tailored to ignite your passion and fuel your ambitions. We believe in the power of talent and are
              dedicated to connecting extraordinary individuals like you with opportunities that align with your unique
              skills and experiences. If you're ready to take that leap and embark on a fulfilling journey that nurtures
              your growth, pushes your boundaries, and celebrates your passion, then don't hesitate any longer. Your
              dream job is just one click away
            </Typography>
            <Typography sx={{ marginTop: '50px', color: 'green' }} variant="body2">
              Click the button below to view our job listings and apply for your dream job today!
            </Typography>
            <Button
              onClick={handleApplyJob}
              sx={{
                width: '25%',
                height: '50px',
                backgroundColor: '#125469',
                '&:hover': { backgroundColor: '#1C8FB4' },
              }}
              variant="contained"
            >
              Find Your Dream Job
            </Button>
          </Box>
        </Box>
      </Container>
      <Dialog open={showJobForm} onClose={handleCloseJobForm} maxWidth="md" fullWidth>
        <PostJob onClose={handleCloseJobForm} />
      </Dialog>
    </React.Fragment>
  );
}
