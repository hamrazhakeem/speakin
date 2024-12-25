import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from "react-hook-form";
import Footer from "../components/Footer";
import useAxios from "../hooks/useAxios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import Navbar from "../components/Navbar";
import { ShieldCheck } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const TutorPasswordChangePage = () => {
  const axiosInstance = useAxios();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
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
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.current_password) {
        const message = error.response.data.current_password[0];
        toast.error(message);
      } else {
        toast.error('An error occurred. Please try again later');
      }
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Account Security</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your password and security preferences
          </p>
        </div>

        {/* Navigation Tabs */}
        <nav className="max-w-4xl mx-auto mb-8 flex space-x-1 rounded-xl bg-blue-50 p-1">
          {[
            { label: 'Profile', path: '/tutor-dashboard' },
            { label: 'Security', path: '/tutor-password-change', active: true },
            { label: 'Sessions', path: '/tutor-sessions' },
            { label: 'Payments', path: '/withdraw' }
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200
                ${tab.active 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FaLock className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Change Password</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    {...register('currentPassword', { required: 'Current password is required' })}
                    className={`w-full px-4 py-3 rounded-xl border bg-white transition-colors duration-200 outline-none pr-12 ${
                      errors.currentPassword 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
                )}
              </div>

              {/* New Password */}
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
                    className={`w-full px-4 py-3 rounded-xl border bg-white transition-colors duration-200 outline-none pr-12 ${
                      errors.newPassword 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password */}
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
                    className={`w-full px-4 py-3 rounded-xl border bg-white transition-colors duration-200 outline-none pr-12 ${
                      errors.confirmPassword 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-medium text-gray-900">Password Requirements</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    One lowercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    One number
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    One special character
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center group"
              >
                {loading ? (
                  <div className="h-5 flex items-center">
                    <LoadingSpinner size="sm" className="text-white" />
                  </div>
                ) : (
                  <>
                    Change Password
                    <FaLock className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TutorPasswordChangePage;