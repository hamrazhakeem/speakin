import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import FinancialDashboard from '../../components/admin/dashboard/FinancialDashboard';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <FinancialDashboard />
    </AdminLayout>
  );
};

export default AdminDashboard;