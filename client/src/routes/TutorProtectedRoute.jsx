import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TutorProtectedRoute = () => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const isTutor = useSelector((state) => state.auth.isTutor);

  if (!isAdmin && !isTutor) {
    return <Navigate to="/tutor-signin" />;
  }

  return <Outlet />; 
};

export default TutorProtectedRoute;