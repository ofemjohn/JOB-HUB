import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import banner from '../assets/banner.jpg';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// import hero1 from '../assets/hero1.jpg';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import hero2 from '../assets/hero2.jpg';



export default function Home() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl" >
        <Box
          
          sx={{
            bgcolor: '#cfe8fc',
            height: '132vh',
            backgroundImage: `url(${banner})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            overflowX: "hidden",
          }}
        >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
            <TextField sx={{ marginTop: "100px", width: "50%", backgroundColor: 'white', }}
            id="standard-basic"
            label="Search Job By Location"
            variant="filled"
            
            />
            <Button variant="contained" color="secondary"
              sx={{
                marginTop: "100px",
                width: "10%",
                marginLeft: '5px',
                height: '56px',
                backgroundColor: '#125469',
                '&:hover': { backgroundColor: '#1C8FB4' },
              }}
            >
              Search
            </Button>
        </Box>
          <Grid container spacing={2} sx={{height: '70vh', marginTop: '400px',}}>
            <Grid item xs={6} sx={{marginTop: '120px'}}>
              {/* Your content for the left side */}
              <Box sx={{ padding: '32px' }}>
                <Typography sx={{color: '#FFFFFF', marginBottom: '15px'}} variant="h3">Create Job Listings & <br />Find the Perfect Candidates</Typography>
                <Typography sx={{marginLeft: '35px', color:'#1C2ED2', marginBottom: '15px'}} variant='h5'>Unlock Your Hiring Potential</Typography>
                <Typography sx={{ marginBottom: '15px', color: 'Dark gray'}} variant="body1">
                  Are you looking to attract top talent and
                  streamline your hiring process? Look no further!
                  Our job posting platform offers you the perfect opportunity
                  to create job listings and connect with qualified candidates
                  from a diverse range of industries.Ready to take the next step
                  in finding the perfect candidate? Click below to create your job
                  listing and embark on a successful hiring journey.
                </Typography>
                <Button
                  sx={{
                    width: '100%',
                    height: '50px',
                    backgroundColor: '#125469',
                    '&:hover': { backgroundColor: '#1C8FB4' },
                  }}
                  variant="contained">Create Job Listing</Button>
              </Box>
            </Grid>
            <Grid item xs={6} sx={{position: 'relative', padding: '32px',}}>
              {/* Your content for the right side */}
              <Box
                sx={{
                  height: '100%',
                  backgroundImage: `url(${hero2})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  filter: 'blur(0px)', // Adjust the blur value as per your preference
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  boxShadow: '0 0 4px 5px rgba(0, 0, 0, 0.7)',
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
              sx={{
            bgcolor: '#f5f5f5',
            height: '70vh',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            overflowX: "hidden",
          }}
        >
              <Box sx={{ padding: '32px'}}>
              <Typography sx={{textAlign: 'center', marginTop: '150px'}} variant="h1">Are you looking for a new challenge?</Typography>
               <Typography sx={{textAlign: 'center', marginTop: '25px', color: '#002278'}} variant='h3'>Welcome to the gateway of endless possibilities!</Typography>
                <Typography sx={{ marginTop: '15px'}} variant="body1">
                If you're craving a thrilling adventure in your career, your search ends here.
                Get ready to embark on a journey of discovery and success,
                as we present you with an unparalleled array of job opportunities
                that are tailored to ignite your passion and fuel your ambitions.
                We believe in the power of talent and are dedicated to connecting
                extraordinary individuals like you with opportunities that align
                with your unique skills and experiences.
                if you're ready to take that leap and embark on a fulfilling journey that nurtures
                your growth, pushes your boundaries, and celebrates your passion,
                then don't hesitate any longer. Your dream job is just one click away
              </Typography>
            <Typography sx={{marginTop: '50px', color: 'green'}} variant="body2">Click the button below to view our job listings and apply for your dream job today!</Typography>
                <Button
                  sx={{
                    width: '25%',
                    height: '50px',
                    backgroundColor: '#125469',
                    '&:hover': { backgroundColor: '#1C8FB4' },
                  }}
                  variant="contained">Apply for Job</Button>
              </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
}
