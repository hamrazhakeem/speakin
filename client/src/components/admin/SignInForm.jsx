import React, { useState } from 'react';
import { Shield, AlertCircle, Lock, Mail } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTokens } from '../../redux/authSlice';
import AdminButton from './ui/AdminButton';

const SignInForm = () => {
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
      navigate('/admin/dashboard');
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo & Badge */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="bg-black border border-zinc-800 rounded-2xl p-3 mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
        <p className="text-zinc-400 mt-2">Access the SpeakIn administration panel</p>
      </div>

      {/* Security Notice */}
      <div className="bg-black border border-zinc-800 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-zinc-400">
          This area is restricted to authorized administrators only. All actions are logged for security purposes.
        </p>
      </div>

      {/* Sign In Form */}
      <div className="bg-black border border-zinc-800 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <AdminButton
            type="submit"
            loading={loading}
            loadingText="Authenticating..."
            fullWidth
          >
            Sign In to Admin Panel
          </AdminButton>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-sm text-zinc-500">
          Protected by SpeakIn security monitoring
        </p>
      </div>
    </div>
  );
};

export default SignInForm;