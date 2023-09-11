import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import axios from 'axios';

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get('/api/applications/applied', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (response.data.success) {
          setAppliedJobs(response.data.applications);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
      }
    };

    fetchAppliedJobs();
  }, []);

  return (
    <Box sx={{ padding: 2, overflowY: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Job Applications History
      </Typography>
      {appliedJobs.length === 0 ? (
        <Paper elevation={3} sx={{ padding: 2, bgcolor: '#D5F0E0' }}>
          <Typography>
            <strong>This user has not applied for any jobs yet....</strong>
          </Typography>
        </Paper>
      ) : (
        appliedJobs.map((job) => (
          <Box
            key={job.id}
            sx={{
              border: '1px solid #ccc',
              padding: 2,
              marginBottom: 2,
              display: 'flex',
              flexDirection: 'column', // Adjust for smaller screens
              bgcolor: '#E0E9E5',
            }}
          >
            <Typography variant="h6">
              Applicant: <strong>{job.applicant_name}</strong>
            </Typography>
            <Typography variant="h6">
              Applied Job Title: <strong>{job.job_title}</strong>
            </Typography>
            <Typography variant="body1">
              Applicant Email: <strong>{job.applicant_email}</strong>
            </Typography>
            <Box display="flex" alignItems="center">
              <LocationOnIcon sx={{ marginRight: 1 }} />
              <Typography variant="body1">
                Location To Applied Job: <strong>{job.location}</strong>
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <ScheduleIcon sx={{ marginRight: 1 }} />
              <Typography variant="body1">
                Applied On: <strong>{job.created_at}</strong>
              </Typography>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default AppliedJobs;
