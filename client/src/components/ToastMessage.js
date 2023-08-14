import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {useSnackbarContext} from '../components/SnackBarContext';

const ToastMessage = () => {
   const { openSnackbar, snackbarSeverity, snackbarMessage, hideSnackbar } =
    useSnackbarContext();

  return (
    <Snackbar open={openSnackbar}
      autoHideDuration={5000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
      >
      <MuiAlert onClose={hideSnackbar}
        severity={snackbarSeverity}
        variant="filled" elevation={6}
      >
        {snackbarMessage}
      </MuiAlert>
    </Snackbar>
  );
};

export default ToastMessage;
