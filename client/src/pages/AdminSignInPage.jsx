import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setTokens } from '../redux/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';

const AdminSignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_GATEWAY_URL}admin/sign-in/`, 
        { email, password }
      );
      const { access, refresh, name, id } = response.data;
      dispatch(setTokens({ 
        accessToken: access, 
        refreshToken: refresh, 
        userName: name, 
        userId: id, 
        isAdmin: true 
      }));
      toast.success('Welcome back, Admin!');
      navigate('/admin/manage-users');
    } catch (error) {
      toast.error('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-center items-center px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Admin Badge */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-3 ring-1 ring-red-500/20">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400">Access the SpeakIn administration panel</p>
        </div>

        {/* Admin Notice */}
        <div className="bg-yellow-500/10 backdrop-blur-sm rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-200">
            This area is restricted to authorized administrators only. All actions are logged for security purposes.
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 ring-1 ring-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="admin@speakin.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Sign In to Admin Panel'
              )}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Protected by SpeakIn security monitoring
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignInPage;
