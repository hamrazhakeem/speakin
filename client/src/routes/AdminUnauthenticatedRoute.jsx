import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UnauthenticatedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  if (isAdmin && isAuthenticated) {
    return <Navigate to="/admin/manage-users" />;
  }

  return children; 
};

export default UnauthenticatedRoute;