import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StudentUnprotectedRoute = ({ children }) => {
  const { isAuthenticated, isTutor } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    if (isTutor) {
      return <Navigate to="/tutor-dashboard" />; 
    }
    return <Navigate to="/home" />;
  }

  return children; 
};

export default StudentUnprotectedRoute;