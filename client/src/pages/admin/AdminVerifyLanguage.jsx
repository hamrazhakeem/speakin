import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import LanguageChangeReview from '../../components/admin/users/LanguageChangeReview';

const AdminVerifyLanguage = () => {
  return (
    <AdminLayout showSidebar={false}>
      <LanguageChangeReview />
    </AdminLayout>
  );
};

export default AdminVerifyLanguage;