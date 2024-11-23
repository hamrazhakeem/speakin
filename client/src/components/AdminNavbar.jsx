import React, { useState } from 'react';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { clearTokens } from '../redux/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
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
      <nav className="fixed w-full z-50 top-0 border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <img
                src="/src/assets/logo.webp"
                className="h-8 w-auto cursor-pointer"
                alt="SpeakIn Logo"
              />
            </div>

            {/* User Menu */}
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">{userName}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">Admin Panel</p>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
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