import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTokens } from '../../../../redux/authSlice';
import { toast } from 'react-hot-toast';
import { tutorApi } from '../../../../api/tutorApi';
import UserTypeSelector from '../../common/ui/signin/UserTypeSelector';
import FormInput from '../../common/ui/input/FormInput';
import PasswordInput from '../../common/ui/input/PasswordInput';
import PrimaryButton from '../../common/ui/buttons/PrimaryButton';
import axios from 'axios';

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userType, setUserType] = useState('tutor');
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    const handleUserTypeChange = (type) => {
      setUserType(type);
      setErrorMessage('');
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage('');
      setIsLoading(true);

      try {
        const response = await tutorApi.signIn(axios, { email, password });
        const { access, refresh, name, id, credits, required_credits } = response;
  
        dispatch(setTokens({ 
          accessToken: access, 
          refreshToken: refresh, 
          userName: name, 
          userId: id, 
          isAdmin: false, 
          isTutor: true, 
          credits: credits, 
          required_credits: required_credits 
        }));
  
        toast.success(`Welcome, ${name}!`);
        navigate('/tutor/dashboard');
      } catch (error) {
        const message = error.response?.data?.detail || 'Login failed. Please try again.';
        toast.error(message);
        console.error('Login failed', message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
        <div className="flex-1 flex justify-center items-center p-4 bg-gray-50 min-h-[calc(100vh-4rem-4rem)]">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mt-10 mb-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to your SpeakIn account</p>
                    </div>

                    <UserTypeSelector
                        selectedType={userType} 
                        onTypeChange={handleUserTypeChange} 
                    />

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormInput
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errorMessage}
                            required
                        />

                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errorMessage}
                            required
                        />

                        <PrimaryButton
                            type="submit"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Sign In
                        </PrimaryButton>

                        {errorMessage && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                {errorMessage}
                            </div>
                        )}
                    </form>

            {/* Footer Links */}
            <div className="mt-6 space-y-4">
              <Link to="/forgot-password" className="block text-center text-blue-600 hover:text-blue-700">
                Forgot password?
              </Link>
              <div className="text-center text-gray-600">
                Want to become a tutor?{' '}
                <Link 
                  to="/tutor/verify-email"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Submit request
                </Link>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default SignInForm; 