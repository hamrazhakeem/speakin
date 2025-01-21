import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import SignInWithGoogleButton from './SignInWithGoogleButton';
import LoadingSpinner from '../../../common/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import FormInput from '../../common/ui/input/FormInput';
import PasswordInput from '../../common/ui/input/PasswordInput';
import UserTypeSelector from '../../common/ui/profile/UserTypeSelector';
import PrimaryButton from '../../common/ui/buttons/PrimaryButton';
import PasswordRequirements from '../../common/ui/input/PasswordRequirements';

const SignUpForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
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

          <UserTypeSelector selectedType="student" />

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
            <div>
              <FormInput
                type="text"
                placeholder="Full Name"
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
                error={errors.name}
              />
            </div>

            <div>
              <FormInput
                type="email"
                placeholder="Email address"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email}
              />
            </div>

            <div>
              <PasswordInput
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
                error={errors.password}
              />
            </div>

            <PasswordRequirements />

            <PrimaryButton
              type="submit"
              disabled={loading}
              className="w-full"
              loading={loading}
            >
              {loading ? (
                <div className="h-5 flex items-center">
                  <LoadingSpinner size="sm" />
                </div>
              ) : (
                <>
                  Create Account
                </>
              )}
            </PrimaryButton>
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
