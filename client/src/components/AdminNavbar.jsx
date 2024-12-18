import React, { useState } from 'react';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { clearTokens } from '../redux/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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

  return (
    <>
      <nav className="fixed w-full z-40 top-0 border-b border-white/10 bg-gray-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              {/* Mobile menu button */}
              <div className="lg:hidden">
                {children}
              </div>
              
              {/* Brand and Section Title */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 text-transparent bg-clip-text">
                    Speak
                  </span>
                  <span className="text-xl font-bold text-white">
                    In
                  </span>
                </div>
                <div className="h-4 w-px bg-white/20" />
                <h1 className="text-sm font-medium text-gray-400">
                  Administration Portal
                </h1>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white rounded-lg 
                    hover:bg-white/5 transition-colors border border-white/10"
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium">{userName}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg ring-1 ring-white/10">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm font-medium text-gray-400">Admin Controls</p>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 
                          transition-colors"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer div to push content below navbar */}
      <div className="h-16" />
    </>
  );
};

export default AdminNavbar;