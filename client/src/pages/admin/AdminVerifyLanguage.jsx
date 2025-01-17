import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import LanguageVerificationContent from '../../components/admin/languages/LanguageVerificationContent';

const AdminVerifyLanguage = () => {
  return (
    <AdminLayout showSidebar={false}>
      <LanguageVerificationContent />
    </AdminLayout>
  );
};

export default AdminVerifyLanguage;