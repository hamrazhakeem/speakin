import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import SignInWithGoogleButton from './SignInWithGoogleButton';
import { ChevronRight, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '../../../common/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

const SignUpForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {                              
      const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}sign-up/`, {
        name: data.name,
        email: data.email,
        password: data.password,
        user_type: 'student'
      });
      
      console.log('Sign up successful', response.data);
      reset();

      const { cache_key } = response.data;
      navigate('/sign-up/verify-otp', { 
        state: { 
          email: data.email,
          cache_key: cache_key
        } 
      });
    } catch (error) {
      if (error.response && error.response.data.errors.email[0] === 'user with this email already exists.') {
        toast.error('This email is already registered. Please try signing in instead.');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center p-4 bg-gray-50 min-h-[calc(100vh-4rem-4rem)]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mt-10 mb-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join SpeakIn to start learning</p>
          </div>

          <div className="mb-6">
            <SignInWithGoogleButton />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Input */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors duration-200 outline-none ${
                  errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
              />
              {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors duration-200 outline-none ${
                  errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors duration-200 outline-none pr-12 ${
                  errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
                  }
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center group"
            >
              {loading ? (
                <div className="h-5 flex items-center">
                  <LoadingSpinner size="sm" />
                </div>
              ) : (
                <>
                  Create Account
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
