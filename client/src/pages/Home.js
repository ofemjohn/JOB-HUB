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
import SearchIcon from '@mui/icons-material/Search';
import FeedbackForm from '../components/FeedbackForm';

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
      const response = await axios.get('/api/joblistings/filter/location', {
        params: {
          location: locationInput,
        },
      });

      if (response.data.success) {
        const jobListingsData = response.data.job_listings;
        setJobListings(jobListingsData);
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
            minHeight: '100vh',
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
              mt: 3,
              mr: 2,
            }}
          >
           <TextField
            sx={{
              width: '80%',
              height: '80%',
              backgroundColor: '#F0F0F0', // Light gray background
              borderRadius: '3px', // Removed rounded edges
            }}
            id="outlined-basic"
            // label="Search Job By Location"
            variant="outlined"
            placeholder='Search Job By Location'
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: 'gray' }} />
              ),
            }}
            InputLabelProps={{
              style: {
                color: '#125469',
                fontSize: '14px', // Increase label font size for better visibility
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            sx={{
              height: '55px',
              backgroundColor: '#125469',
              color: 'white',
              borderRadius: '2px',
              padding: '0 24px',
              '&:hover': { backgroundColor: '#1C8FB4' }, // Hover effect
            }}
          >
            Search
          </Button>


          </Box>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 3,
                  bgcolor: 'white',
                  borderRadius: '4px',
                  mt: '100px',
                }}
              >
                <Typography variant="h4" color="textPrimary">
                  Create Job Listings & Find the Perfect Candidates
                </Typography>
                <Typography variant="h6" color="primary">
                  Unlock Your Hiring Potential
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Are you looking to attract top talent and streamline your hiring process? Our job posting platform offers you the perfect opportunity to create job listings and connect with qualified candidates.
                </Typography>
                <Button
                  onClick={handleCreateJob}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, backgroundColor: '#125469',
                '&:hover': { backgroundColor: '#1C8FB4' }, }}
                >
                  Create a Job Posting
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Grid container sx={{ mt: 4, mb: 4, height: '100%' }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">
                Are you looking for a new challenge?
              </Typography>
              <Typography variant="h6" color="primary">
                Welcome to the gateway of endless possibilities!
              </Typography>
              <Typography variant="body1">
                If you're craving a thrilling adventure in your career, your search ends here. Get ready to embark on a journey of discovery and success, as we present you with an unparalleled array of job opportunities that are tailored to ignite your passion and fuel your ambitions.
              </Typography>
              <Button
                onClick={handleApplyJob}
                variant="contained"
                color="primary"
                sx={{ mt: 2, backgroundColor: '#125469',
              '&:hover': { backgroundColor: '#1C8FB4', marginRight: '10px' }, }}
              >
                Find Your Dream Job
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: '100%',
                backgroundImage: `url(${hero2})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: '4px',
                boxShadow: '0 0 4px 5px rgba(0, 0, 0, 0.7)',
              }}
            />
          </Grid>
        </Grid>
        <Dialog open={showJobForm} onClose={handleCloseJobForm} maxWidth="md" fullWidth>
          <PostJob onClose={handleCloseJobForm} />
        </Dialog>
        <Box sx={{ width: '100%', mt: '100px', mb: '100px', bgcolor: 'white' }}>
          <FeedbackForm />
        </Box>

      </Container>
    </React.Fragment>
  );
}
