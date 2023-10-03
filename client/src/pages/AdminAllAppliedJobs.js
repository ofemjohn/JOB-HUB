import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText, Divider, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminAllAppliedJobs = () => {
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if the user is authenticated as an admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');

    if (!isAdmin) {
      // If not authenticated as admin, redirect to admin login page
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get('/api/admin/all-applied-jobs');
        setAppliedJobs(response.data.applications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  return (
    <Box sx={{marginLeft: '25px'}}>
      <Typography sx={{color: 'teal'}} variant="h4" gutterBottom>
        All Applied Jobs
      </Typography>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <List>
          {appliedJobs.map((job) => (
            <div key={job.id}>
              <ListItem>
                <ListItemText
                  primary={`Job Title: ${job.job_title}`}
                  secondary={`Location: ${job.location}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={`Applicant Name: ${job.applicant_name}`}
                  secondary={`Applicant Email: ${job.applicant_email}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Applied At: ${job.created_at}`} />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AdminAllAppliedJobs;
