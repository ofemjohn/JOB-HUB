import React, { useState } from 'react';
import axios from 'axios';
import { Avatar, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useSnackbarContext } from '../components/SnackBarContext';


function PostJob({ onClose, jobListingId }) {
  const { showSnackbar } = useSnackbarContext();

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
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('applicant_name', formData.applicant_name);
      formDataToSend.append('applicant_email', formData.applicant_email);
      formDataToSend.append('resume', formData.resume);
      formDataToSend.append('cover_letter', formData.cover_letter);

      const response = await axios.post(`/api/apply_job/${jobListingId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (response.data.success) {
        showSnackbar('success', response.data.message);
        onClose();
      } else {
        showSnackbar('error', response.data.message);
      }
    } catch (error) {
      showSnackbar('error', error.response?.data?.message || 'An error occurred while applying for the job.');
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
          <Avatar sx={{ bgcolor: '#055525' }}>
            <CreateNewFolderIcon />
          </Avatar>
          <Typography variant="h5">Apply for the Job</Typography>
        </Grid>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField label="Your Name" required variant="outlined" name="applicant_name" fullWidth onChange={handleChange} />
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
            <Button variant="contained" type="submit" fullWidth sx={{ backgroundColor: '#055525', color: '#fff' }}>
              Submit Application
            </Button>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
}

export default PostJob;