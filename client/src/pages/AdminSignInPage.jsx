import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { setTokens } from '../redux/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminSignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [animate, setAnimate] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Trigger form and logo animation after page loads
    setAnimate(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}admin_signin/`, { email, password });
            toast.success('Sign In successful!');
            console.log('tokens-->', response.data);
            const { access, refresh, name, id } = response.data;
            
            dispatch(setTokens({ accessToken: access, refreshToken: refresh, userName: name, userId: id, isAdmin: true }));
            navigate('/admin/manage-users');
    } catch (error) {
        toast.error('Sign In failed. Invalid credentials.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-blue-100 px-4 sm:px-6">
      <div className={`w-full max-w-sm sm:max-w-md bg-white p-8 shadow-lg rounded-lg transform transition-transform duration-700 ease-out ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="mb-6 text-center">
          <img 
            src="/src/assets/logo.webp" 
            alt="Admin Logo"
            className={`mx-auto w-32 sm:w-40 h-20 sm:h-24 object-contain animate-pulse ${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-blue-500 font-sans">SpeakIn Admin</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            required
            className={`mb-4 p-3 border rounded-lg focus:ring-2 outline-none transition-all duration-300 ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-blue-300 focus:ring-blue-500 hover:shadow-md'
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className={`mb-4 p-3 border rounded-lg focus:ring-2 outline-none transition-all duration-300 ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-blue-300 focus:ring-blue-500 hover:shadow-md'
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className={`p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
  
};

export default AdminSignInPage;
