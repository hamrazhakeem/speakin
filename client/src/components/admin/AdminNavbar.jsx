import React, { useState } from 'react';
import { LogOut, ChevronDown, Search } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { clearTokens } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Avatar from '../Avatar';

const AdminNavbar = ({ children }) => {
  const { userName } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    dispatch(clearTokens());
    navigate('/admin/sign-in');
  };

  const getHomePath = () => '/admin/dashboard';

  return (
    <nav className="fixed w-full z-40 top-0 bg-black border-b border-zinc-800">
      <div className="max-w-full px-4 mx-auto">
        <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {children}
            <div className="flex items-center gap-2">
              <img
                onClick={() => navigate(getHomePath())}
                src="/src/assets/logo-white.webp"
                className="h-8 w-auto cursor-pointer"
                alt="SpeakIn Logo"
              />
            </div>
        </div>

          <div className="flex items-center gap-6">

            {/* User Menu */}
          <div className="relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
                <Avatar name={userName} size={32} />
                <span className="text-sm font-medium text-white">{userName}</span>
                <ChevronDown className="h-4 w-4 text-zinc-400" />
            </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg bg-black border border-zinc-800 py-1 z-50">
                  <div className="px-4 py-3 border-b border-zinc-800">
                    <p className="text-sm font-medium text-white">{userName}</p>
                    <p className="text-xs text-zinc-400">Administrator</p>
                  </div>
                  <div className="py-1">
                <button
                  onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-zinc-800 flex items-center gap-2"
                >
                      <LogOut className="h-4 w-4" />
                      Sign out
                </button>
              </div>
                </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;