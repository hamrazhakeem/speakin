import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StudentUnprotectedRoute = () => {
  const { isAuthenticated, isTutor, isAdmin } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    if (isTutor) {
      return <Navigate to="/tutor-dashboard" />; 
    }
    if (isAdmin) {
      return <Navigate to="/admin/manage-users" />;
    }
    return <Navigate to="/home" />;
  }

  return <Outlet />; 
};

export default StudentUnprotectedRoute;