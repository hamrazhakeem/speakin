import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StudentProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return children; 
};

export default StudentProtectedRoute;