import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import TutorVerificationContent from '../../components/admin/users/TutorVerificationContent';

const AdminVerifyTutor = () => {
  return (
    <AdminLayout showSidebar={false}>
      <TutorVerificationContent />
    </AdminLayout>
  );
};

export default AdminVerifyTutor;
