import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Avatar, Grid, Paper } from '@mui/material';
import Person3Icon from '@mui/icons-material/Person3';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import FaceIcon from '@mui/icons-material/Face';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HomeIcon from '@mui/icons-material/Home';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        console.log('Fetching profile data...');
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
          console.log('No access token found. Redirecting to unauthorized...');
          navigate('/unauthorized');
          return;
        }

        // Decode the token to check if it's expired
        const decodedToken = parseJwt(access_token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          // Redirect to unauthorized page if the token is expired
          navigate('/unauthorized');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };

        const response = await axios.get('/api/profile', config);

        if (response.data.success) {
          console.log('Profile Data from API:', response.data.profile); // Debugging line
          setProfileData(response.data.profile);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfileData();
  }, [navigate]);

  // Function to decode JWT token
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  if (!profileData) {
    return <Typography>Loading profile...</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Paper elevation={3} sx={{ padding: 2, bgcolor: 'teal' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Avatar sx={{ width: 120, height: 120 }}>
              <Person3Icon fontSize="large" />
            </Avatar>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h6" gutterBottom>
              <FaceIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} />
              <strong style={{ marginLeft: '2rem' }}>{profileData.username}</strong>
            </Typography>
            <Typography variant="body1">
              <EmailIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} />
              <strong style={{ marginLeft: '2rem' }}>{profileData.email}</strong>
            </Typography>
            <Typography variant="body1">
              <LocationOnIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} />
              <strong style={{ marginLeft: '2rem' }}>{profileData.address}</strong>
            </Typography>
            <Typography variant="body1">
              <PhoneIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} />
              <strong style={{ marginLeft: '2rem' }}>{profileData.phone}</strong>
            </Typography>
            <Typography variant="body1">
              <PublicIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} />
              <strong style={{ marginLeft: '2rem' }}>{profileData.country}</strong>
            </Typography>
            <Typography variant="body1">
              <HomeIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} />
              <strong style={{ marginLeft: '2rem' }}>{profileData.address}</strong>
            </Typography>
            <Typography variant="body1">
              <AccessTimeIcon sx={{ marginRight: 2, verticalAlign: 'middle' }} />
              <strong style={{ marginLeft: '1rem' }}>{new Date(profileData.created_at).toLocaleString()}</strong>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Profile;
