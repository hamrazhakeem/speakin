import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = () => {
  const { isAuthenticated, isTutor, isStudent } = useSelector((state) => state.auth);

  if (isAuthenticated){
    if (isTutor) return <Navigate to="/tutor/dashboard" />;
    if (isStudent) return <Navigate to="/home" />;
    return <Navigate to="/admin/dashboard" />;
  }

  return <Outlet />; 
};

export default PublicRoute;