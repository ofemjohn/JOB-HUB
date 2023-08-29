import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Paper } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';

const PostedJobs = () => {
   const [postedJobs, setPostedJobs] = useState([]);

    useEffect(() => {
        const fetchPostedJobs = async () => {
            try {
                const response = await axios.get('/api/applications/listings', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });

                if (response.data.success) {
                    setPostedJobs(response.data.listings);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching posted jobs:', error);
            }
        };

        fetchPostedJobs();
    }, []);

   return (
        <Box sx={{ padding: 2, maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Job Posted History
            </Typography>
            {postedJobs.length === 0 ? (
                <Paper elevation={3} sx={{ padding: 2, bgcolor: '#D5F0E0' }}>
                    <Typography><strong>This user has not posted any jobs yet....</strong></Typography>
                </Paper>
            ) : (
                postedJobs.map((listing) => (
                    <Box
                        key={listing.job_listing_id}
                        sx={{
                            border: '1px solid #ccc',
                            padding: 2,
                            marginBottom: 2,
                            display: 'flex',
                            alignItems: 'center',
                             bgcolor: '#E0E9E5',
                        }}
                    >
                        <Box flexGrow={1}>
                            <Typography variant="h8">Job Title: {listing.title}</Typography>
                            <Typography variant="body1">Salary: {listing.salary}</Typography>
                            <Typography variant="body1">Poster Email: {listing.application_email}</Typography>
                            <Box display="flex" alignItems="center">
                                <LocationOnIcon sx={{ marginRight: 1 }} />
                                <Typography variant="body1">Location: {listing.location}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <ScheduleIcon sx={{ marginRight: 1 }} />
                                <Typography variant="body1">Listing Type: {listing.listing_type}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <ScheduleIcon sx={{ marginRight: 1 }} />
                                <Typography variant="body1">Posted On: {listing.created_at}</Typography>
                            </Box>
                        </Box>
                        {/* <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                        >
                            Delete
                        </Button> */}
                    </Box>
                ))
            )}
        </Box>
    );
}

export default PostedJobs;
