import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import TutorVerificationContent from '../../components/admin/tutors/TutorVerificationContent';

const AdminVerifyTutor = () => {
  return (
    <AdminLayout showSidebar={false}>
      <TutorVerificationContent />
    </AdminLayout>
  );
};

export default AdminVerifyTutor;
