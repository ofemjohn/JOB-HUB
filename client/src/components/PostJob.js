import React, { useState } from 'react';
import axios from 'axios';
import {
  Avatar,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  MenuItem,
} from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useNavigate } from 'react-router-dom';
import { useSnackbarContext } from './SnackBarContext';

const experienceLevels = ['Entry-level', 'Mid-level', 'Senior'];
const jobTypes = ['Full-time', 'Part-time', 'Contract'];

function PostJob({ onClose }) {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarContext();
  const [formError, setFormError] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    listing_type: '',
    application_email: '',
    application_link: '',
    job_type: '',
    skills_required: '',
    experience_level: '',
    application_deadline: '',
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!formData.listing_type) {
      setFormError(true);
      return;
    }
    try {
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

      const response = await axios.post('/api/joblisting', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data.success) {
        showSnackbar('success', response.data.message);
        onClose();
      } else {
        showSnackbar('error', response.data.message);
      }
    } catch (error) {
      showSnackbar('error', error.response?.data?.message || 'An error occurred while posting the job.');
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
      <Paper elevation={24} sx={{ height: 'fit-content', margin: '20px auto', width: '100%', padding: '20px', position: 'relative' }}>
        <Button variant="text" color="success" onClick={onClose} sx={{ position: 'absolute', top: '5px', right: '5px', zIndex: 1 }}>
          <CloseRoundedIcon />
        </Button>
        <Grid align="center">
          <Avatar sx={{ bgcolor: '#055525' }}>
            <CreateNewFolderIcon />
          </Avatar>
          <Typography variant="h5">Hire the Best Talent</Typography>
        </Grid>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <FormControl required error={formError}>
                <FormLabel id="demo-row-radio-buttons-group-label">Are you posting this job for yourself or on behalf of a third party?</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="listing_type"
                  value={formData.listing_type}
                  onChange={handleChange}
                >
                  <FormControlLabel value="self" control={<Radio />} label="I am posting this job for myself" />
                  <FormControlLabel value="third party" control={<Radio />} label="I am posting this job on behalf of a third party" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <TextField label="Title" required variant="outlined" name="title" placeholder="Enter the job title" fullWidth maxLength={50} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Location" required variant="outlined" name="location" placeholder="Enter job location" fullWidth onChange={handleChange} />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <TextField label="Salary" required variant="outlined" name="salary" placeholder="Enter the salary amount" fullWidth onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Email" variant="outlined" name="application_email" type="email" placeholder="Enter the email to apply for job" fullWidth onChange={handleChange} />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <TextField label="Application Link" variant="outlined" name="application_link" placeholder="Please enter the third party application link" fullWidth onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Job Type"
                variant="outlined"
                name="job_type"
                select // Use select for dropdown menu
                fullWidth
                onChange={handleChange}
                value={formData.job_type}
              >
                {jobTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <TextField
                label="Skills Required"
                variant="outlined"
                name="skills_required"
                placeholder="Enter required skills"
                fullWidth
                multiline // Enable multiline
                rows={4} // Adjust the number of rows
                onChange={handleChange}
                // inputProps={{ maxLength: 1000 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Experience Level"
                variant="outlined"
                name="experience_level"
                select // Use select for dropdown menu
                fullWidth
                onChange={handleChange}
                value={formData.experience_level}
              >
                {experienceLevels.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                label="Application Deadline"
                variant="outlined"
                name="application_deadline"
                placeholder="Enter application deadline"
                fullWidth
                onChange={handleChange}
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                label="Job Description"
                required
                variant="outlined"
                name="description"
                placeholder="Job Description"
                fullWidth
                multiline
                rows={4}
                onChange={handleChange}
                // inputProps={{ maxLength: 1000 }} // Add this line to restrict input length
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button variant="contained" type="submit" fullWidth
              sx={{
                backgroundColor: '#125469',
                '&:hover': { backgroundColor: '#1C8FB4' },
                color: '#fff'
                
              }}
            >
              Post a Job
            </Button>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
}

export default PostJob;
