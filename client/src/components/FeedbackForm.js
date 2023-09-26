import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Grid } from '@mui/material';
import { useSnackbarContext } from '../components/SnackBarContext'; // Import the Snackbar context
import axios from 'axios';

export default function FeedbackForm() {
  const [feedbackType, setFeedbackType] = useState('employed');
  const [jobTitle, setJobTitle] = useState('');
  const [date, setDate] = useState('');
  const [comments, setComments] = useState('');

  const { showSnackbar } = useSnackbarContext(); // Access the Snackbar context

  const handleFeedbackTypeChange = (event) => {
    setFeedbackType(event.target.value);
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  const maxRetries = 3; // Maximum number of retries
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await axios.post('/api/send_feedback', {
        feedbackType,
        jobTitle,
        date,
        comments,
      });

      if (response.data.success) {
        // Show a success Snackbar message
        showSnackbar('success', 'Feedback submitted successfully');
        // Optionally reset the form fields
        setFeedbackType('employed');
        setJobTitle('');
        setDate('');
        setComments('');
        return; // Exit the loop if the submission is successful
      } else {
        // Show an error Snackbar message
        showSnackbar('error', response.data.message);
        return; // Exit the loop on error
      }
    } catch (error) {
      // Show an error Snackbar message
      showSnackbar('error', 'Error submitting feedback');

      retries++; // Increment the retry counter
      if (retries >= maxRetries) {
        // Maximum retries reached, show an error message and exit the loop
        showSnackbar('error', 'Maximum retry attempts reached');
        break;
      }

      // Wait for a short time before retrying (e.g., 1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};


  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          background: '#f5f5f5',
          boxShadow: 3,
          padding: 4,
          borderRadius: '8px',
          textAlign: 'center',
          color: 'black',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Feedback Form
        </Typography>
        <Typography variant="body1" paragraph>
          We value your feedback! Please use this form to share your employment status with us.
          Your input helps us track the success of job postings and applications on our platform.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Feedback Type"
                placeholder="Feedback Type"
                value={feedbackType}
                onChange={handleFeedbackTypeChange}
                required
                select
              >
                <MenuItem value="employed">I Employed Someone</MenuItem>
                <MenuItem value="gotEmployed">I Got Employed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                type="date"
                label="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextareaAutosize
                fullWidth
                minRows={4}
                placeholder="Comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', marginTop: '16px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
            backgroundColor: '#125469',
            '&:hover': { backgroundColor: '#1C8FB4' },
            color: '#fff'
          }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}
