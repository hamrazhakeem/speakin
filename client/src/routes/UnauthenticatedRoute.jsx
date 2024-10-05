import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UnauthenticatedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return children; 
};

export default UnauthenticatedRoute;