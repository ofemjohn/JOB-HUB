import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbarContext } from '../components/SnackBarContext';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarContext();

  // Check if the user is authenticated as an admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');

    if (!isAdmin) {
      // If not authenticated as admin, redirect to admin login page
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear the isAdmin marker from localStorage
    localStorage.removeItem('isAdmin');
    showSnackbar('success', 'succesfully logged out Administrator');

    // Redirect to the admin login page
    navigate('/admin');

  };

  const handleAllAppliedJobs = () => {
    // Redirect to the All Applied Jobs page
    navigate('/adminall-applied-jobs');
  };

  const handleAllPostedJobs = () => {
    // Redirect to the All Posted Jobs for Approval page
    navigate('/adminall-posted-jobs');
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleDeleteExpiredJobs = async () => {
    try {
      // Make a DELETE request to delete expired jobs
      const response = await axios.delete('/api/admin/delete-expired-jobs');
      
      // Show a success snackbar message
      showSnackbar('success', response.data.message);
    } catch (error) {
      // Show an error snackbar message
      showSnackbar('error', 'Expired jobs unavailable');
      
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout Admin
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Dashboard Overview
              </Typography>
              <Typography variant="body2">
                Welcome to the admin dashboard. Here, you can manage job listings and applications.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Button variant="contained" color="primary" onClick={handleAllAppliedJobs} sx={{ marginBottom: 2 }}>
                All Applied Jobs
              </Button>
              <Button variant="contained" color="primary" onClick={handleAllPostedJobs} sx={{ marginBottom: 2 }}>
                All Posted Jobs for Approval
              </Button>
              <Button variant="contained" color="primary" onClick={handleHome} sx={{ marginBottom: 2 }}> 
                Home
              </Button>
              <Button variant="contained" color="primary" onClick={handleDeleteExpiredJobs} sx={{ marginBottom: 2 }}>
                Delete Expired Jobs
             </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default AdminDashboard;
