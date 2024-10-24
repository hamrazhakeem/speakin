import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TutorUnprotectedRoute = () => {
  const { isAuthenticated, isTutor } = useSelector((state) => state.auth);

  console.log("TutorUnprotectedRoute-------", isAuthenticated, isTutor);
  if (isAuthenticated && isTutor) {
    return <Navigate to="/tutor-dashboard" />; 
  }

  return <Outlet />;
}

export default TutorUnprotectedRoute;