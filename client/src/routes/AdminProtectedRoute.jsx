import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminProtectedRoute = ({ children }) => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  
  if (!isAdmin) {
    return <Navigate to="/admin/signin" />;
  }

  return children; 
};

export default AdminProtectedRoute;