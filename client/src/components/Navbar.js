import * as React from 'react';
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

const pages = ['Home', 'Login', 'Dashboard']; // Remove 'Logout' from the pages array

const Navbar = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarContext();

  // Function to handle logout
  const handleLogout = async () => {
    try {
      const access_token = localStorage.getItem("access_token");

      // Check if the access token exists in the local storage
      if (!access_token) {
        showSnackbar('error', "Access token not found. Please login first.");
        return;
      }

      // Add the access token to the authorization header
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      const response = await axios.post("/api/logout", null, { headers });

      if (response.data.success) {
        localStorage.removeItem("access_token"); // Clear the JWT token from local storage
        showSnackbar('success', response.data.message);
        navigate('/login'); // Redirect to the login page after logout
      } else {
        showSnackbar('error', response.data.message);
      }
    } catch (error) {
      console.log('Error logging out', error);
      showSnackbar('error', "Error logging out. Please try again.");
    }
  };

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Check if the user is logged in based on the existence of the access token in the localStorage
  const isLoggedIn = !!localStorage.getItem("access_token");

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
                  justifyContent: { xs: 'flex-end', md: 'flex-start' },
                }}
              >
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  {pages.map((page) => (
                    <Link
                      key={page}
                      to={page === 'Home' ? '/' : `/${page.toLowerCase()}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button
                        onClick={handleCloseNavMenu}
                        sx={{ my: 2, color: 'white', marginLeft: '8px' }}
                      >
                        {page}
                      </Button>
                    </Link>
                  ))}
                </Box>

                {/* Render the Logout button only when the user is logged in */}
                {isLoggedIn && (
                  <Button
                    onClick={handleLogout}
                    sx={{
                      my: 2,
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
}

export default Navbar;
