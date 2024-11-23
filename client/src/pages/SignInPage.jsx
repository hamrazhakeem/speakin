import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useDispatch } from 'react-redux';
import { setTokens } from '../redux/authSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoogleLoginButton from '../components/GoogleButton';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}sign-in/`, { email, password });
      const { access, refresh, name, id, credits } = response.data;

      dispatch(setTokens({ accessToken: access, refreshToken: refresh, userName: name, userId: id, isAdmin: false, isStudent: true, credits: credits }));

      toast.success(`Welcome, ${name}!`);
      navigate('/home');
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed. Please try again.';
      setErrorMessage(message);
      console.error('Login failed', message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex justify-center items-center p-4 mt-16 md:mt-24 mb-10">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">SpeakIn ID</h1>
          <p className="text-gray-600 mb-6 text-sm md:text-base">Sign In to your SpeakIn Account</p>
          
          {/* Google Login Button */}
          <div className="mb-6 flex justify-center">
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

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="email"
              placeholder="Email"
              required
              className={`mb-4 p-2 border rounded focus:ring-2 outline-none ${
                errorMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              className={`mb-4 p-2 border rounded focus:ring-2 outline-none ${
                errorMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Sign In
            </button>
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          </form>

          <div className="flex flex-col space-y-2 mt-4">
            <button
              onClick={() => navigate('/sign-up')}
              className="text-blue-500 border border-blue-500 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 rounded px-4 py-2 text-sm font-medium"
            >
              Create your SpeakIn ID
            </button>
            <Link to="/forgot-password" className="text-blue-500 hover:underline focus:outline-none">
              Forgotten your password?
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignInPage;