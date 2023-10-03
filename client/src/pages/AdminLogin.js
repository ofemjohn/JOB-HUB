import * as React from 'react';
import { useState } from 'react';
import { Avatar, Grid, Paper, TextField, Typography } from '@mui/material';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useSnackbarContext } from '../components/SnackBarContext';
import { useNavigate } from 'react-router-dom';

const AdminLoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { showSnackbar } = useSnackbarContext();

  const handleLogin = async (event) => {
  event.preventDefault();
  const data = {
    username,
    password,
  };

  try {
    const response = await axios.post('/api/admin-login', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response && response.data && response.data.success) {
      // Set a flag or marker in localStorage to indicate that the user is logged in as an admin
      localStorage.setItem('isAdmin', 'true');
      showSnackbar('success', response.data.message);

      // Redirect to the admin dashboard
      navigate('/admin-dashboard');
    } else {
      showSnackbar('error', response && response.data ? response.data.message : 'Login failed');
    }
  } catch (error) {
    showSnackbar('error', error.response && error.response.data ? error.response.data.message : 'An error occurred');
  }
};


  return (
    <Grid container justifyContent="center" alignItems="center" sx={{height: '80vh' }}>
      <Paper elevation={24} sx={{ minHeight: '300px', margin: '20px auto', width: '280px', padding: '20px' }}>
        <form onSubmit={handleLogin}>
          <Grid justifyContent="center" alignItems="center" align="center">
            <Avatar sx={{ bgcolor: '#055525' }}>
              <LockTwoToneIcon />
            </Avatar>
            <Typography variant="h5">Admin Login</Typography>
          </Grid>
          <TextField
            id="username"
            label="Username"
            variant="standard"
            placeholder="Enter Username"
            fullWidth
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <TextField
            id="password"
            label="Password"
            variant="standard"
            placeholder="Enter Password"
            fullWidth
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            fullWidth
            size="small"
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#125469',
              '&:hover': { backgroundColor: '#1C8FB4' },
              color: '#fff',
              marginTop: '16px', // Add some spacing
            }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Grid>
  );
};

export default AdminLoginForm;
