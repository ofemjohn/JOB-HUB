import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
// import Typography from '@mui/material/Typography';
import Person2Icon from '@mui/icons-material/Person2';
import MailIcon from '@mui/icons-material/Mail';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { useSnackbarContext } from '../components/SnackBarContext'; // Import Snackbar context
import axios from 'axios'; // Import axios for API requests

import Profile from '../components/Profile';
import AppliedJobs from '../components/AppliedJobs';
import PostedJobs from '../components/PostedJobs';
import { Toolbar } from '@mui/material';

function Dashboard() {
  const [selectedTab, setSelectedTab] = useState(0);
  const { showSnackbar } = useSnackbarContext(); // Use the Snackbar context for displaying messages

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabContents = [
    <Profile />,
    <AppliedJobs />,
    <PostedJobs />,
  ];

  const tabs = [
    { label: 'Profile', icon: <Person2Icon /> },
    { label: 'Applied Jobs', icon: <MailIcon /> },
    { label: 'Posted Jobs', icon: <PostAddIcon /> },
  ];

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Rest of the logout logic
      const access_token = localStorage.getItem('access_token');

      if (!access_token) {
        // If access token is not found, show the appropriate message
        showSnackbar('success', 'Logged out successfully.');
        // Redirect to the login page after logout
        window.location.href = '/login';
        return;
      }

      // Remove the access token from local storage
      localStorage.removeItem('access_token');

      // Add the access token to the authorization header
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      const response = await axios.post('/api/logout', null, { headers });

      if (response.data.success) {
        showSnackbar('success', response.data.message);
        // Redirect to the login page after logout
        window.location.href = '/login';
      } else {
        showSnackbar('error', response.data.message);
      }
    } catch (error) {
      console.log('Error logging out', error);
      showSnackbar('error', 'Error logging out. Please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{backgroundColor: '#2E3B55'}}>
        <Tabs sx={{color: 'white'}}
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab sx={{color: 'white'}}
              key={index}
              label={tab.label}
              icon={tab.icon}
            />
          ))}
          <Tab sx={{color: 'white'}}
            label="Home"
            component={Link}
            to="/"
            icon={<AddHomeWorkIcon />}
          />
          <Tab sx={{color: 'white'}}
            label="Logout"
            onClick={handleLogout}
            icon={<LogoutIcon />}
          />
        </Tabs>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {/* <Typography variant="h5" gutterBottom>
          {tabs[selectedTab].label}
        </Typography> */}
        {tabContents[selectedTab]}
      </Box>
    </Box>
  );
}

export default Dashboard;
