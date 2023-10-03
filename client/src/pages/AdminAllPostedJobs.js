import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText, Button, Divider, Box } from '@mui/material';
import axios from 'axios';

const AdminAllPostedJobs = () => {
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        const response = await axios.get('/api/admin/all-posted-jobs');
        setPostedJobs(response.data.job_listings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posted jobs:', error);
        setLoading(false);
      }
    };

    fetchPostedJobs();
  }, []);

  const handleApproveJob = async (jobId) => {
    try {
      // Make a copy of the current jobs array
      const updatedJobs = [...postedJobs];

      // Find the index of the job to be approved
      const jobIndex = updatedJobs.findIndex(job => job.id === jobId);

      // Update the approved status locally
      updatedJobs[jobIndex].approved = true;

      // Update the state to trigger a re-render
      setPostedJobs(updatedJobs);

      // Send a PUT request to approve the job
      await axios.put(`/api/admin/approve-job/${jobId}`);

      console.log('Job approved successfully!');
    } catch (error) {
      console.error('Error approving job:', error);
    }
  };

  const handleDeleteJob = async (jobId) => {
  try {
    // Update the state using the state updater form of setPostedJobs
    setPostedJobs((prevJobs) => prevJobs.filter(job => job.id !== jobId));

    // Send a DELETE request to delete the job
    await axios.delete(`/api/admin/delete-job/${jobId}`);

    console.log('Job deleted successfully!');
  } catch (error) {
    console.error('Error deleting job:', error);
  }
};

  return (
    <Box sx={{marginLeft: '25px'}}>
      <Typography sx={{color: 'teal'}} variant="h4" gutterBottom>
        All Posted Jobs for Approval
      </Typography>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <List>
          {postedJobs.map((job) => (
            <div key={job.id}>
              <ListItem>
                <ListItemText
                  primary={`Job Title: ${job.title}`}
                  secondary={`Location: ${job.location}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={`Job Type: ${job.job_type}`}
                  secondary={`Experience Level: ${job.experience_level}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Posted At: ${job.created_at}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Application Deadline: ${job.application_deadline}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Skills Required: ${job.skills_required}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Description: ${job.description}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Salary: ${job.salary}`} />
              </ListItem>
              {!job.approved && (
                <>
                  <Button sx={{mr: 1}} variant="contained" color="primary" onClick={() => handleApproveJob(job.id)}>
                    Approve Job
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDeleteJob(job.id)}>
                    Delete Job
                  </Button>
                </>
              )}
              <Divider sx={{mt: 0.5}} />
            </div>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AdminAllPostedJobs;
