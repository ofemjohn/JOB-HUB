import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Person2Icon from '@mui/icons-material/Person2';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSnackbarContext } from '../components/SnackBarContext';
import { useNavigate } from 'react-router-dom';
import Profile from '../components/Profile';
import PostedJobs from '../components/PostedJobs';
import AppliedJobs from '../components/AppliedJobs';




const drawerWidth = 240;

function Dashboard(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState('profile');
  const { window } = props;
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarContext();

 // Function to handle logout
  const handleLogout = async () => {
  try {
    // Rest of the logout logic
    const access_token = localStorage.getItem('access_token');

    if (!access_token) {
      // If access token is not found, show the appropriate message
      showSnackbar('success', 'Logged out successfully.');
      navigate('/login'); // Redirect to the login page after logout
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
      navigate('/login'); // Redirect to the login page after logout
    } else {
      showSnackbar('error', response.data.message);
    }
  } catch (error) {
    console.log('Error logging out', error);
    showSnackbar('error', 'Error logging out. Please try again.');
  }
};


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Function to format the time as HH:MM:SS
  const formatTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };


  const handleSectionClick = (section) => {
    setSelectedSection(section);
    handleDrawerToggle(); // Close the drawer when a section is clicked
  };

  // Initialize the selected section when the component mounts
  React.useEffect(() => {
    setSelectedSection('Profile');
  }, []);

  const drawer = (
    <div>
      <Toolbar>
          <img
            src={logo} // Update the import path for the logo.png file
            alt="Logo"
            style={{
              width: '50px',
              height: '50px',
              marginRight: '5px',
            }}
        />
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/" // Change this to "/"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          JOB HUB
        </Typography>
            </Toolbar>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleSectionClick('Profile')}>
                  <ListItemIcon>
                    <Person2Icon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleSectionClick('Applied Jobs')}>
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Applied Jobs" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleSectionClick('Posted Jobs')}>
                  <ListItemIcon>
                    <PostAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Posted Jobs" />
                </ListItemButton>
              </ListItem>
            </List>

            <Divider />
            <List>
              <ListItem key="Home" disablePadding>
                <ListItemButton component={Link} to="/">
                  <ListItemIcon>
                    <AddHomeWorkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
              <ListItem key="Logout" disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          </div>
        );


  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
         <Toolbar sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto', // Two columns: one takes the remaining space, the other auto size
          justifyContent: 'center', // Align items to the center horizontally
          bgcolor: '#2E3B55',
        }}>
          <Typography variant="h6" noWrap component="div" sx={{ textAlign: 'center' }}>
            User Dashboard
          </Typography>
          <div sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Typography variant="body2" color="inherit">
              Current Time: {formatTime()}
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
       <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {/* Render the selected section */}
        {selectedSection === 'Profile' && <Profile />}
        {selectedSection === 'Applied Jobs' && <AppliedJobs />}
        {selectedSection === 'Posted Jobs' && <PostedJobs />}
      </Box>
    </Box>
  );
}

export default Dashboard;