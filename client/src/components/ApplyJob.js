import React, { useState } from 'react';
import axios from 'axios';
import {
  Avatar,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
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
    setSubmissionProgress(0);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('applicant_name', formData.applicant_name);
      formDataToSend.append('applicant_email', formData.applicant_email);
      formDataToSend.append('resume', formData.resume);
      formDataToSend.append('cover_letter', formData.cover_letter);

      const accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        navigate('/unauthorized');
        return;
      }

      const decodedToken = parseJwt(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        navigate('/unauthorized');
        return;
      }

      const response = await axios.post(
        `/api/apply_job/${jobListingId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setSubmissionProgress(progress);
          },
        }
      );

      if (response.data.success) {
        showSnackbar('success', response.data.message);
        onClose();
      } else {
        showSnackbar('error', response.data.message);
      }

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
      showSnackbar(
        'error',
        error.response?.data?.message || 'An error occurred while applying for the job.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Paper elevation={24} sx={{ margin: '20px auto', padding: '20px' }}>
        <Button
          variant="text"
          color="success"
          onClick={onClose}
          sx={{ position: 'absolute', top: '5px', right: '5px', zIndex: 1 }}
        >
          <CloseRoundedIcon />
        </Button>
        <Grid align="center">
          <Avatar sx={{ bgcolor: '#055525', mb: '25px' }}>
            <AttachEmailIcon />
          </Avatar>
          <Typography variant="h5">Job Title || {job.title}</Typography>
        </Grid>
        <form onSubmit={handleFormSubmit}>
          <TextField
            label="Provide Full Name"
            required
            variant="outlined"
            name="applicant_name"
            fullWidth
            sx={{ mt: 2 }}
            onChange={handleChange}
          />
          <TextField
            label="Your Email"
            required
            variant="outlined"
            name="applicant_email"
            type="email"
            fullWidth
            sx={{ mt: 2 }}
            onChange={handleChange}
          />
          <input
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            id="resume-upload"
            name="resume"
            type="file"
            onChange={handleChange}
          />
          <label htmlFor="resume-upload">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              sx={{ mt: 2 }}
            >
              {formData.resume ? formData.resume.name : 'Upload Resume'}
            </Button>
          </label>
          <input
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            id="cover-letter-upload"
            name="cover_letter"
            type="file"
            onChange={handleChange}
          />
          <label htmlFor="cover-letter-upload">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              sx={{ mt: 2 }}
            >
              {formData.cover_letter ? formData.cover_letter.name : 'Upload Cover Letter'}
            </Button>
          </label>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              backgroundColor: '#125469',
              '&:hover': { backgroundColor: '#1C8FB4' },
              color: '#fff',
              position: 'relative',
              mt: 2,
            }}
            disabled={isSubmitting}
          >
            Submit Application
            {isSubmitting && (
              <LinearProgressWithLabel value={submissionProgress} />
            )}
          </Button>
        </form>
      </Paper>
    </Grid>
  );
}

export default ApplyJob;