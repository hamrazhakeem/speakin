import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StudentRoute = () => {
  const { isAuthenticated, isTutor } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  if (isTutor) return <Navigate to="/tutor/dashboard" />;

  return <Outlet />; 
};

export default StudentRoute;