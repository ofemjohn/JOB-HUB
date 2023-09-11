import React, { useState } from 'react';
import { Avatar, Button, Grid, MenuItem, Paper, TextField, Typography } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import axios from 'axios';
import { useSnackbarContext } from '../components/SnackBarContext';
import { useNavigate } from "react-router-dom";
import countriesData from '../components/countriesData.json';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarContext();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    Country: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Apply length restrictions for certain fields if needed
    if (name === "skills_required" || name === "description") {
      if (value.length <= 1000) {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post('/api/register', formData);
      if (response.data.success) {
        showSnackbar('success', response.data.message);
        navigate('/');
        // window.location.reload();
      } else {
        showSnackbar('error', response.data.message);
      }
    } catch (error) {
      showSnackbar('error', error.response.data.message);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Paper elevation={24} sx={{ margin: '20px auto', padding: '20px', maxWidth: '400px', width: '100%' }}>
        <Grid align='center' sx={{ marginBottom: '20px' }}>
          <Avatar sx={{ bgcolor: '#055525' }}><PersonAddIcon /></Avatar>
          <Typography variant='h5'>Register</Typography>
        </Grid>
        <TextField
          label="Username"
          variant="outlined"
          name="username"
          required
          placeholder='Enter your Full name'
          value={formData.username}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: '16px' }}
        />
        <TextField
          label="Email"
          variant="outlined"
          name="email"
          required
          placeholder='Enter your email address'
          value={formData.email}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: '16px' }}
        />
        <TextField
          label="Password"
          variant="outlined"
          name="password"
          required
          placeholder='Enter your Password'
          type='password'
          value={formData.password}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: '16px' }}
        />
        <TextField
          label="Address"
          variant="outlined"
          name="address"
          required
          placeholder='Enter your House address'
          value={formData.address}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: '16px' }}
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          name="phone"
          required
          placeholder='Enter your Phone Number'
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: '16px' }}
        />
        <TextField
          select
          required
          label="Select Country"
          variant="outlined"
          value={formData.selectedCountry}
          onChange={handleChange}
          fullWidth
          name="Country"
          sx={{ marginBottom: '16px' }}
        >
          <MenuItem value="">
            <em>Select a country</em>
          </MenuItem>
          {countriesData.map((country) => (
            <MenuItem key={country.code} value={country.name}>
              {country.name}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          onClick={handleSignUp}
          fullWidth
          sx={{
            backgroundColor: '#125469',
            '&:hover': { backgroundColor: '#1C8FB4' },
            color: '#fff'
          }}
        >
          Sign Up
        </Button>
      </Paper>
    </Grid>
  )
}

export default RegisterForm;
