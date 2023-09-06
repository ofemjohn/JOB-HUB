import React, { useState } from 'react';
import axios from 'axios';
import { Avatar, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useSnackbarContext } from './SnackBarContext';
import LinearProgressWithLabel from '../components/LinearProgressWithLabel';
import { useNavigate } from 'react-router-dom';

function ApplyJob({ onClose, jobListingId, job }) {
  const { showSnackbar } = useSnackbarContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_email: '',
    resume: null,
    cover_letter: null,
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: files ? files[0] : value,
    }));
  };

   const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionProgress(0); // Reset the progress to 0 before submitting

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('applicant_name', formData.applicant_name);
      formDataToSend.append('applicant_email', formData.applicant_email);
      formDataToSend.append('resume', formData.resume);
      formDataToSend.append('cover_letter', formData.cover_letter);

      const accessToken = localStorage.getItem('access_token');

      // Check if the token exists and is not expired
      if (!accessToken) {
        // Redirect to unauthorized page if the token is missing
        navigate('/unauthorized');
        return;
      }

      // Decode the token to check if it's expired
      const decodedToken = parseJwt(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        // Redirect to unauthorized page if the token is expired
        navigate('/unauthorized');
        return;
      }


      const response = await axios.post(`/api/apply_job/${jobListingId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setSubmissionProgress(progress);
        },
      });

      if (response.data.success) {
        showSnackbar('success', response.data.message);
        onClose();
      } else {
        showSnackbar('error', response.data.message);
      }
      // Redirect to third-party link if the response contains a redirect_url
      if (response.data.redirect_url) {
        let redirectUrl = response.data.redirect_url;
      if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
        redirectUrl = 'https://' + redirectUrl;
      }

      if (!redirectUrl) {
        showSnackbar('The application link to this application is not available');
      } else {
        window.location.replace(redirectUrl);
      }
    }
    } catch (error) {
      showSnackbar('error', error.response?.data?.message || 'An error occurred while applying for the job.');
    } finally {
      setIsSubmitting(false);
    }
   };
  
  // Function to decode JWT token
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Paper elevation={24} sx={{ height: '65vh', margin: '20px auto', width: '800px', padding: '20px', position: 'relative' }}>
        {/* "Exit" button (using the icon button at the top) */}
        <Button variant="text" color="success" onClick={onClose} sx={{ position: 'absolute', top: '5px', right: '5px', zIndex: 1 }}>
          <CloseRoundedIcon />
        </Button>
        <Grid align="center">
          <Avatar sx={{ bgcolor: '#055525', mb: '25px' }}>
            <AttachEmailIcon />
          </Avatar>
          <Typography variant="h5">Job Title || {job.title}</Typography>
        </Grid>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField label="Provide Full Name" required variant="outlined" name="applicant_name" fullWidth onChange={handleChange} />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField label="Your Email" required variant="outlined" name="applicant_email" type="email" fullWidth onChange={handleChange} />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <input
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                id="resume-upload"
                name="resume"
                type="file"
                onChange={handleChange}
              />
              <label htmlFor="resume-upload">
                <Button variant="outlined" component="span" fullWidth>
                  {formData.resume ? formData.resume.name : 'Upload Resume'}
                </Button>
              </label>
            </Grid>
            <Grid item xs={6}>
              <input
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                id="cover-letter-upload"
                name="cover_letter"
                type="file"
                onChange={handleChange}
              />
              <label htmlFor="cover-letter-upload">
                <Button variant="outlined" component="span" fullWidth>
                  {formData.cover_letter ? formData.cover_letter.name : 'Upload Cover Letter'}
                </Button>
              </label>
            </Grid>
          </Grid>
          <Grid item sx={{ width: '100%', mt: 2 }}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                backgroundColor: '#125469',
                '&:hover': { backgroundColor: '#1C8FB4' },
                color: '#fff', position: 'relative'
              }}
              disabled={isSubmitting}
            >
              Submit Application
              {isSubmitting && (
                 <LinearProgressWithLabel value={submissionProgress} />
              )}
            </Button>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
}

export default ApplyJob;
