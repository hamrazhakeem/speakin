import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useAxios from "../hooks/useAxios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const StudentPasswordChangePage = () => {
  const axiosInstance = useAxios();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post('change-password/', {
        current_password: data.currentPassword,
        new_password: data.newPassword
      });
      reset();
      if (response.status === 200) {
        toast.success('Password changed successfully');
      } else if (response.status === 400 && response.data.current_password) {
        const message = response.data.current_password[0];
        toast.error(message);
      }
      console.log(response.data);
    } catch (error) {
      if (error.response.status === 400 && error.response.data.current_password) {
        const message = error.response.data.current_password[0];
        toast.error(message);
      }
      else{
        toast.error('An error occurred. Please try again later');
      }
      console.error('Error changing password:', error);
    }
  }; 

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Account Security</h1>

            <nav className="flex space-x-6 mb-8 border-b pb-4">
              <button className="text-gray-600 text-lg hover:text-green-600 transition-colors" onClick={() => navigate('/profile')}>Profile</button>
              <button className="text-green-600 font-semibold text-lg hover:text-green-800 transition-colors" onClick={() => navigate('/student-password-change')}>Security</button>
              <button className="text-gray-600 text-lg hover:text-green-600 transition-colors" onClick={() => navigate('/bookings')}>Bookings</button>
              <button className="text-gray-600 text-lg hover:text-green-600 transition-colors">Refer a friend</button>
            </nav>

            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Change Password</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      {...register('currentPassword', { required: 'Current password is required' })}
                      className={`w-full px-4 py-2 rounded-lg border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      {showCurrentPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                    </button>
                  </div>
                  {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      {...register('newPassword', { 
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        },
                        validate: {
                          noSpaces: value =>
                            value.trim() === value || 'Password must not start or end with spaces',
                          complexity: value =>
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/.test(value) ||
                            'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
                        }
                      })}
                      className={`w-full px-4 py-2 rounded-lg border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      {showNewPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register('confirmPassword', { 
                        required: 'Please confirm your new password',
                        validate: value => 
                          value === getValues('newPassword') || 'The passwords do not match'
                      })}
                      className={`w-full px-4 py-2 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      {showConfirmPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <FaLock className="mr-2" /> Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentPasswordChangePage;