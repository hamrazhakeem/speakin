import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import SessionsManagement from '../../components/admin/sessions/SessionsManagement';

const AdminManageSessions = () => {
  return (
    <AdminLayout>
      <SessionsManagement />
    </AdminLayout>
  );
};

export default AdminManageSessions;