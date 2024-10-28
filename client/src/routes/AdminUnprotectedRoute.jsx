import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminUnprotectedRoute = () => {
  const { isAuthenticated, isTutor, isStudent } = useSelector((state) => state.auth);

  if (isAuthenticated){
    if (isTutor) return <Navigate to="/tutor-dashboard" />;
    if (isStudent) return <Navigate to="/home" />;
    return <Navigate to="/admin/manage-users" />;
  }

  return <Outlet />; 
};

export default AdminUnprotectedRoute;