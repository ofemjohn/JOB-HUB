import * as React from 'react';
import { Avatar, Grid, Paper, TextField, Typography } from '@mui/material';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

const LoginForm = () => {
  return (
    <Grid container justifyContent="center" alignItems="center">
        <Paper elevation={24} sx={{ height: '55vh', margin: '20px auto', width: '280px', padding: '20px' }} >
          <Grid justifyContent="center" alignItems="center"  align='center'>
          <Avatar  sx={{bgcolor: '#055525'}}><LockTwoToneIcon /></Avatar> <br />
            <Typography variant='h5'>Login</Typography>
        </Grid>
        <TextField id="standard-basic" label="email" variant="standard" placeholder='Enter Email' fullWidth required />
        <TextField id="standard-basic" label="password" variant="standard" placeholder='Enter Password' fullWidth required type='password' />
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="Remember me" />
        </FormGroup>
        <Button fullWidth size="small" variant='contained'  sx={{ backgroundColor: '#055525', color: '#fff' }}>login</Button>
        </Paper>
    </Grid>
  )
}
export default LoginForm
