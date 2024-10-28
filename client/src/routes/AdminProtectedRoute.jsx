import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminProtectedRoute = () => {
  const { isAuthenticated, isTutor, isStudent }= useSelector((state) => state.auth);
  
  if (isAuthenticated) {
    if (isTutor) {
      return <Navigate to="/tutor-dashboard" />;
    }
    if (isStudent) {
      return <Navigate to="/home" />;
    }
  }

  if(!isAuthenticated) {
    return <Navigate to="/admin/signin" />;
  }

  return <Outlet />; 
};

export default AdminProtectedRoute; 