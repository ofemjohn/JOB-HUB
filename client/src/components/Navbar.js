import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import logo from '../assets/logo.png';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { useSnackbarContext } from '../components/SnackBarContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const Navbar = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarContext();

  // Function to handle logout
  const handleLogout = async () => {
    try {
      const access_token = localStorage.getItem('access_token');

      // Check if the access token exists in the local storage
      if (!access_token) {
        showSnackbar('error', 'Access token not found. Please login first.');
        return;
      }

      // Add the access token to the authorization header
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      const response = await axios.post('/api/logout', null, { headers });

      if (response.data.success) {
        localStorage.removeItem('access_token'); // Clear the JWT token from local storage
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

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Check if the user is logged in based on the existence of the access token in the localStorage
  const isLoggedIn = !!localStorage.getItem('access_token');
  const isAuthorized = isLoggedIn; // Modify this condition based on your authorization logic

  // Function to handle dashboard click
  const handleDashboardClick = () => {
    const access_token = localStorage.getItem('access_token');

    if (access_token) {
      navigate('dashboard');
    } else {
      navigate('unauthorized');
    }
  };

  // Responsive Menu State
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2E3B55' }}>
      <Container>
        <Toolbar disableGutters>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={logo} // Update the import path for the logo.png file
                  alt="Logo"
                  style={{
                    width: '30px',
                    height: '30px',
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
              </Box>
            </Grid>

            <Grid item>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <IconButton
                  onClick={toggleMenu}
                  sx={{ color: 'white', display: { md: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>

                {/* Render the Menu Drawer for mobile */}
                <Drawer
                  anchor="right"
                  open={menuOpen}
                  onClose={toggleMenu}
                  PaperProps={{
                    sx: {
                      width: '200px',
                    },
                  }}
                >
                  <List>
                    <ListItem
                      button
                      onClick={toggleMenu}
                      component={Link}
                      to="/"
                    >
                      <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem
                      button
                      onClick={toggleMenu}
                      component={Link}
                      to="/login"
                    >
                      <ListItemText primary="Login" />
                    </ListItem>
                    {isAuthorized && (
                      <ListItem button onClick={handleLogout}>
                        <ListItemText primary="Logout" />
                      </ListItem>
                    )}
                    <ListItem // Add the Dashboard link for mobile view
                      button
                      onClick={() => {
                        toggleMenu();
                        handleDashboardClick();
                      }}
                    >
                      <ListItemText primary="Dashboard" />
                    </ListItem>
                  </List>
                </Drawer>

                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    ml: 2,
                  }}
                >
                  <Link to="/" style={{ textDecoration: 'none' }}>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ color: 'white', marginLeft: '8px' }}
                    >
                      Home
                    </Button>
                  </Link>
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ color: 'white', marginLeft: '8px' }}
                    >
                      Login
                    </Button>
                  </Link>
  
                  <Button
                    onClick={handleDashboardClick}
                    sx={{ color: 'white', marginLeft: '8px' }}
                  >
                    Dashboard
                  </Button>

                   <Link to="/admin" style={{ textDecoration: 'none' }}>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ color: 'white', marginLeft: '8px' }}
                    >
                      Admin
                    </Button>
                  </Link>
                </Box>

                {/* Render the Logout button only when the user is authorized */}
                {isAuthorized && (
                  <Button
                    onClick={handleLogout}
                    sx={{
                      color: 'white',
                      marginLeft: '8px',
                      display: { xs: 'none', md: 'block' },
                    }}
                  >
                    Logout
                  </Button>
                )}

                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  {/* ... (other code) */}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
