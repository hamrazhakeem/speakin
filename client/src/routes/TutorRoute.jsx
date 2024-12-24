import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TutorRoute = () => {
  const { isAuthenticated, isStudent } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/tutor-sign-in" />;
  }

  if (isStudent) return <Navigate to="/home" />;

  return <Outlet />; 
};

export default TutorRoute;