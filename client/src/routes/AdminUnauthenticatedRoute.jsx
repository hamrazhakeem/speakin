import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminUnauthenticatedRoute = ({ children }) => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  if (isAdmin) {
    return <Navigate to="/admin/manage-users" />;
  }

  return children; 
};

export default AdminUnauthenticatedRoute;