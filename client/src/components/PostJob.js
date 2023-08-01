// PostJob.js
import React from 'react';
import { Avatar, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

function PostJob({ onClose }) {
  
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Paper elevation={24} sx={{ height: '65vh', margin: '20px auto', width: '450px', padding: '20px', position: 'relative' }}>
        {/* "Exit" button (using the icon button at the top) */}
        <Button variant="text" color="success" onClick={onClose} sx={{ position: 'absolute', top: '5px', right: '5px', zIndex: 1 }}>
          <CloseRoundedIcon />
        </Button>
        <Grid align="center">
          <Avatar sx={{ bgcolor: '#055525' }}>
            <CreateNewFolderIcon />
          </Avatar>
          <Typography variant="h5">Hire the Best Talent</Typography>
        </Grid>
        <Grid item sx={{ width: '100%', mt: 2 }}>
          <TextField label="Username" variant="outlined" name="username" required placeholder="Enter your Full name" fullWidth />
        </Grid>
        <Grid item sx={{ width: '100%', mt: 2 }}>
          <TextField label="Email" variant="outlined" name="email" required placeholder="Enter your email address" fullWidth />
        </Grid>
        <Grid item sx={{ width: '100%', mt: 2 }}>
          <TextField label="Password" variant="outlined" name="password" required placeholder="Enter your Password" type="password" fullWidth />
        </Grid>
        <Grid item sx={{ width: '100%', mt: 2 }}>
          <TextField label="Address" variant="outlined" name="address" required placeholder="Enter your House address" fullWidth />
        </Grid>
        <Grid item sx={{ width: '100%', mt: 2 }}>
          <TextField label="Phone Number" variant="outlined" name="phone" required placeholder="Enter your Phone Number" fullWidth />
        </Grid>
        <Grid item sx={{ width: '100%', mt: 2 }}>
          <Button variant="contained" fullWidth sx={{ backgroundColor: '#055525', color: '#fff' }}>
            Sign Up
          </Button>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default PostJob;
