import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TutorUnprotectedRoute = () => {
  const { isAuthenticated, isStudent, isAdmin } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    if (isStudent) {
      return <Navigate to="/home" />; 
    }
    if (isAdmin) {
      return <Navigate to="/admin/manage-users" />;
    }
    return <Navigate to="/tutor-dashboard" />;
  }

  return <Outlet />; 
}

export default TutorUnprotectedRoute;