import React, { useState, useEffect } from 'react';
import { Avatar, Button, Grid, MenuItem, Paper, TextField, Typography } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import axios from 'axios';



const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    Country : '',
  })


  // const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState([]);

  const apiUrl = 'https://restcountries.com/v3.1/all';

  useEffect(() => {
    const getCountries = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        // Extract only the required country data (name and code)
        const countryData = data.map((country) => ({
          name: country.name.common,
          code: country.cca2,
        }));
        setCountries(countryData);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    getCountries();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };


  const handleSignUp = async () => {
    try {
      const response = await axios.post('/api/register', formData);
      if (response.data.success) {
        console.log('Successfully registered', response.data.success);
      } else {
        console.log('Failed to register', response.data.message);
      }
    } catch (error) {
      console.log('Failed to register', error);
    }
  };


  return (
    <Grid container justifyContent="center" alignItems="center">
        <Paper elevation={24} sx={{ height: '65vh', margin: '20px auto', width: '450px', padding: '20px' }} >
          <Grid  align='center'>
          <Avatar sx={{bgcolor: '#055525'}}><PersonAddIcon /></Avatar>
            <Typography variant='h5'>Register</Typography>
        </Grid>
        <Grid item sx={{ width: '100%', mt: 2 }}>
            <TextField
              label="Username"
              variant="outlined"
            name="username"
            required
            placeholder='Enter your username'
            value={formData.username}
            onChange={handleChange}
            fullWidth
            />
        </Grid>
        <Grid item sx={{ width: '100%', mt: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
            name="email"
            required
            placeholder='Enter your email address'
            value={formData.email}
            onChange={handleChange}
            fullWidth
            />
        </Grid>
         <Grid item sx={{ width: '100%', mt: 2 }}>
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
            />
        </Grid>
         <Grid item sx={{ width: '100%', mt: 2 }}>
            <TextField
              label="Address"
              variant="outlined"
            name="address"
            required
            placeholder='Enter your House address'
            value={formData.address}
            onChange={handleChange}
            fullWidth
            />
        </Grid>
         <Grid item sx={{ width: '100%', mt: 2 }}>
            <TextField
              label="Phone Number"
              variant="outlined"
            name="phone"
            required
            placeholder='Enter your Phone Number'
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            />
        </Grid>
        <Grid item sx={{ width: '100%', mt: 2 }}>
            <TextField
              select
              label="Select Country"
              variant="outlined"
              value={formData.selectedCountry}
              onChange={handleChange}
              fullWidth
              name="Country" // Add a name to the TextField
            >
               <MenuItem value="">
              <em>Select a country</em>
            </MenuItem>
            {countries.map((country) => (
              <MenuItem key={country.code} value={country.code}>
                {country.name}
              </MenuItem>
            ))}
            </TextField>
        </Grid>
        <Grid item sx={{ width: '100%', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSignUp}
              fullWidth
              sx={{ backgroundColor: '#055525', color: '#fff' }}
            >
              Sign Up
          </Button>
          </Grid>
        </Paper>
    </Grid>
  )
}
export default LoginForm
