import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTokens } from '../redux/authSlice';
import { toast } from 'react-toastify';

const GoogleLoginButton = () => {
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');

  const isSignUpPage = location.pathname === '/sign-up';

  const handleSuccess = async (codeResponse) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}google-sign-in/`, { 
        "code": codeResponse.code 
      });
      const { access, refresh, name, id, credits } = response.data;
      dispatch(setTokens({ accessToken: access, refreshToken: refresh, userName: name, userId: id, isAdmin: false, isStudent: true, credits: credits }));
      toast.success(`Welcome, ${name}!`);
      navigate('/home');
    } catch (error) {
        const message = error.response?.data?.detail || 'Login failed. Please try again.';
        setErrorMessage(message);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: handleSuccess,
    flow: 'auth-code',
  });


  return (
    <div className="flex flex-col justify-center w-full">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center w-full space-x-2 p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
      >
        <svg 
          className="w-5 h-5" 
          viewBox="0 0 48 48"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
        <span className="font-medium">
          {isSignUpPage ? 'Sign up with Google' : 'Sign in with Google'}
        </span>
      </button>
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default GoogleLoginButton;