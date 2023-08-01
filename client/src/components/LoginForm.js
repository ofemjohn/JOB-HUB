import * as React from 'react';
import { useState } from 'react';
import { Avatar, Grid, Paper, TextField, Typography } from '@mui/material';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useSnackbarContext } from '../components/SnackBarContext';
import { useNavigate } from "react-router-dom";


const LoginForm = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showSnackbar } = useSnackbarContext();

  

  const handleLogin = async (event) => {
    event.preventDefault();
    
    const data = {
      email,
      password,
    };

    try {
    const response = await axios.post("/api/authenticate", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });      
      if (response.data.success) {
        console.log('Successfully registered', response.data.success);
        localStorage.setItem("access_token", response.data.access_token);
        console.log(response.data);
        showSnackbar('success', response.data.message);
        navigate('/');
      } else {
        console.log(response.data.message);
        showSnackbar('error', response.data.message);
    }   
    } catch (error) {
      console.log('Failed to register', error);
      showSnackbar('error', error.response.data.message);
    }
  };
  

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Paper elevation={24} sx={{ height: '55vh', margin: '20px auto', width: '280px', padding: '20px' }}>
        <form onSubmit={handleLogin}>
          <Grid justifyContent="center" alignItems="center" align='center'>
            <Avatar sx={{ bgcolor: '#055525' }}><LockTwoToneIcon /></Avatar> <br />
            <Typography variant='h5'>Login</Typography>
          </Grid>
          <TextField
            id="email"
            label="Email"
            variant="standard"
            placeholder='Enter Email'
            fullWidth
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            id="password"
            label="Password"
            variant="standard"
            placeholder='Enter Password'
            fullWidth
            required
            type='password'
            value={password}
            onChange={(event ) => setPassword(event.target.value)}
          />
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Remember me" />
          </FormGroup>
          <Button 
            fullWidth
            size="small"
            type='submit'
            variant='contained'
            sx={{ backgroundColor: '#055525', color: '#fff' }}
          > 
            Login
          </Button>
        </form>
      </Paper>
    </Grid>
  )
  }

export default LoginForm
