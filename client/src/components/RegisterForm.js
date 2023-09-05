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
    Country : '',
  })

  // const [countries, setCountries] = useState([]);
  

  // const apiUrl = 'https://restcountries.com/v3.1/all';

  // useEffect(() => {
  //   const getCountries = async () => {
  //     try {
  //       const response = await fetch(apiUrl);
  //       const data = await response.json();
  //       // Extract only the required country data (name and code)
  //       const countryData = data.map((country) => ({
  //         name: country.name.common,
  //         code: country.cca2,
  //       }));
  //       setCountries(countryData);
  //     } catch (error) {
  //       console.error('Error fetching countries:', error);
  //     }
  //   };
  //   getCountries();
  // }, []);

  const handleChange = (event) => {
  const { name, value } = event.target;

  // Apply length restrictions for skills_required and description fields
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
        console.log('Successfully registered', response.data.success);
        showSnackbar('success', response.data.message);
        navigate('/login');
        window.location.reload();
        
      } else {
        console.log(response.data.message);
        showSnackbar('error', response.data.message);
      }
    } catch (error) {
      showSnackbar('error', error.response.data.message);
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
            placeholder='Enter your Full name'
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
              required
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
            {countriesData.map((country) => (
              <MenuItem key={country.code} value={country.name}>
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
export default RegisterForm
