import React from 'react';
import { Route, Navigate } from 'react-router-dom';

function AdminRoute({ element, isAdmin }) {
  if (isAdmin) {
    return <Route element={element} />;
  } else {
    return <Navigate to="/unauthorized" />;
  }
}

export default AdminRoute;
