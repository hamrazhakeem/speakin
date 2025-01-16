import React from 'react';
import SignInForm from '../../components/admin/SignInForm';

const AdminSignIn = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 sm:px-6">
      <SignInForm />
    </div>
  );
};

export default AdminSignIn;