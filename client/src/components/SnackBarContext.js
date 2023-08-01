import React, { createContext, useState, useContext } from 'react';

// Create the SnackbarContext
const SnackbarContext = createContext();

// Create a custom hook to access the snackbar context
export const useSnackbarContext = () => useContext(SnackbarContext);

// Create the SnackbarProvider to wrap the entire application
export const SnackbarProvider = ({ children }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Function to show the snackbar message
  const showSnackbar = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  // Function to hide the snackbar
  const hideSnackbar = () => {
    setOpenSnackbar(false);
  };


  return (
    <SnackbarContext.Provider
      value={{
        openSnackbar,
        snackbarSeverity,
        snackbarMessage,
        showSnackbar,
        hideSnackbar,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};
