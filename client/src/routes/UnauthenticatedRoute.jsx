import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UnauthenticatedRoute = ({ children }) => {
  const { isAuthenticated, isTutor } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    if (isTutor) {
      return <Navigate to="/tutor-home" />; // Or wherever tutors should go when authenticated
    }
    return <Navigate to="/home" />;
  }

  return children; 
};

export default UnauthenticatedRoute;