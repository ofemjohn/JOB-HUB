import React, { useState } from 'react';
import { Avatar, Grid, Paper, Typography, TextField, Button, MenuItem } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const RegisterForm = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    // Add other registration fields as needed
  });

  // Countries data obtained from the API (mock data for example)
  const countries = [
    { code: 'us', name: 'United States' },
    { code: 'ca', name: 'Canada' },
    { code: 'gb', name: 'United Kingdom' },
    // Add more countries as needed
  ];

  const handleChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignUp = () => {
    // Your sign-up form submission logic here
    // formData object contains the user's registration details
    console.log(formData);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Paper elevation={24} sx={{ height: '55vh', margin: '20px auto', width: '450px', padding: '20px' }}>
        <Grid container direction="column" justifyContent="center" alignItems="center" height="100%">
          <Grid item>
            <Avatar sx={{ bgcolor: '#055525' }}>
              <PersonAddIcon />
            </Avatar>
            <Typography variant="h5">Register</Typography>
          </Grid>
          <Grid item sx={{ width: '100%', mt: 2 }}>
            <TextField
              label="First Name"
              variant="outlined"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item sx={{ width: '100%', mt: 2 }}>
            <TextField
              label="Last Name"
              variant="outlined"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item sx={{ width: '100%', mt: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item sx={{ width: '100%', mt: 2 }}>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item sx={{ width: '100%', mt: 2 }}>
            <TextField
              select
              label="Select Country"
              variant="outlined"
              value={selectedCountry}
              onChange={handleChange}
              fullWidth
            >
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
        </Grid>
      </Paper>
    </Grid>
  );
};

export default RegisterForm;
