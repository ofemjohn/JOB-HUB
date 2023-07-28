import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import logo from '../assets/logo.png';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';

const pages = ['Home', 'Login', 'Dashboard', 'Logout'];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
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
                  justifyContent: { xs: 'flex-end', md: 'flex-start' },
                }}
              >
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  {pages.map((page) => (
                    <Link key={page} to={page === 'Home' ? '/' : `/${page.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                      <Button
                        onClick={handleCloseNavMenu}
                        sx={{ my: 2, color: 'white', marginLeft: '8px' }}
                      >
                        {page}
                      </Button>
                    </Link>
                  ))}
                </Box>

                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: 'block', md: 'none' },
                    }}
                  >
                    {pages.map((page) => (
                      <MenuItem key={page} onClick={handleCloseNavMenu}>
                        {page}
                      </MenuItem>
                    ))}
                  </Menu>
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
