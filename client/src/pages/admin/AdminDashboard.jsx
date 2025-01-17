import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DashboardContent from '../../components/admin/dashboard/DashboardContent';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
};

export default AdminDashboard;