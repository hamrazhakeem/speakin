import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import LanguageVerificationContent from '../../components/admin/users/LanguageVerificationContent';

const AdminVerifyLanguage = () => {
  return (
    <AdminLayout showSidebar={false}>
      <LanguageVerificationContent />
    </AdminLayout>
  );
};

export default AdminVerifyLanguage;