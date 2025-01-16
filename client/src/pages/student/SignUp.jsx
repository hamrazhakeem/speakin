import React, { useState } from 'react';
import Footer from '../../components/user/Footer';
import Navbar from '../../components/user/Navbar';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import GoogleLoginButton from '../../components/user/GoogleButton';
import { ChevronRight, Eye, EyeOff, UserPlus } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const SignUp = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [backendErrors, setBackendErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const [sendingEmail, setSendingEmail] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setSendingEmail(true);
    try {                              
      const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}sign-up/`, {
        name: data.name,
        email: data.email,
        password: data.password,
        user_type: 'student',
      });
      
      console.log('Sign up successful', response.data);
      reset();
      setBackendErrors({});

      const { cache_key } = response.data;
      navigate('/sign-up/verify-otp', { 
        state: { 
          email: data.email, 
          cache_key,
          message: 'Please check your email for the OTP code.' 
        } 
      });
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setBackendErrors(error.response.data.errors);
      } else {
        setBackendErrors({ general: 'Something went wrong. Please try again.' });
      }
    } finally {
      setLoading(false);
      setSendingEmail(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 flex justify-center items-center p-4 mt-16 md:mt-24 mb-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Icon Header */}
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-blue-50 rounded-full">
                <UserPlus className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            {/* Header Text */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join SpeakIn and start learning</p>
            </div>

            {/* Google Login Button */}
            <div className="mb-6">
              <GoogleLoginButton />
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with email</span>
              </div>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Input */}
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors duration-200 outline-none ${
                    errors.name || backendErrors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  {...register('name', {
                    required: 'Name is required',
                    pattern: {
                      value: /^(?!.*\s{2,})[a-zA-ZÀ-ž]+(([' -][a-zA-ZÀ-ž])?[a-zA-ZÀ-ž]*)*$/,
                      message: 'Please enter a valid name',
                    },
                  })}
                />
                {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
                {backendErrors.name && <p className="mt-1 text-red-500 text-sm">{backendErrors.name}</p>}
              </div>

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors duration-200 outline-none ${
                    errors.email || backendErrors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email',
                    },
                  })}
                />
                {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
                {backendErrors.email && <p className="mt-1 text-red-500 text-sm">{backendErrors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors duration-200 outline-none pr-12 ${
                    errors.password || backendErrors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters long',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>}
                {backendErrors.password && <p className="mt-1 text-red-500 text-sm">{backendErrors.password}</p>}
              </div>

              {/* General Error Message */}
              {backendErrors.general && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start">
                  <span className="shrink-0 mr-2">⚠️</span>
                  {backendErrors.general}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center group"
              >
                {loading ? (
                  <div className="h-5 flex items-center gap-3">
                    <LoadingSpinner size="sm"/>
                  </div>
                ) : (
                  <>
                    Create Account
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <p className="mt-6 text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>

            {/* Password Requirements */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Password must contain:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• At least 8 characters</li>
                <li>• One uppercase letter</li>
                <li>• One lowercase letter</li>
                <li>• One number</li>
                <li>• One special character</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
