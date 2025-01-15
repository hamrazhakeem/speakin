import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useDispatch } from 'react-redux';
import { setTokens } from '../redux/authSlice';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { ChevronRight, User, GraduationCap, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const TutorSignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleStudentClick = () => {
    navigate('/sign-in');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}tutor-sign-in/`, { email, password });
      const { access, refresh, name, id, credits, required_credits } = response.data;

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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 flex justify-center items-center p-4 mt-16 md:mt-24 mb-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back, Tutor</h1>
              <p className="text-gray-600">Sign in to your SpeakIn account</p>
            </div>

            {/* User Type Selector */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleStudentClick}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 border-gray-200 hover:bg-gray-50"
              >
                <GraduationCap size={20} />
                <span className="font-medium">Student</span>
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 bg-blue-50 border-blue-200 text-blue-600"
              >
                <User size={20} />
                <span className="font-medium">Tutor</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors duration-200 outline-none ${
                    errorMessage ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors duration-200 outline-none pr-12 ${
                    errorMessage ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center group"
              >
                {isLoading ? (
                  <div className="h-5 flex items-center">
                    <LoadingSpinner size="sm"/>
                  </div>
                ) : (
                  <>
                    Sign In
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

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
      </main>
      <Footer />
    </div>
  );
};

export default TutorSignInPage;
