import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Bell, User, Menu, X, CreditCard, LogOut, Settings, Plus } from 'lucide-react';
import { clearTokens, updateCredits } from '../redux/authSlice';
import useAxios from '../hooks/useAxios';

const TutorNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, userId, credits } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchUserCredits = async () => {
      try {
        const response = await axiosInstance.get(`users/${userId}/`);
        console.log(response)
        if (response.data.balance_credits !== credits) {
          dispatch(updateCredits(response.data.balance_credits));
        }
      } catch (error) {
        console.error('Error fetching user credits:', error);
      }
    };

    if (isAuthenticated && userId) {
      fetchUserCredits();
    }
  }, [isAuthenticated, userId, dispatch, credits]);

  const handleLogout = () => {
    dispatch(clearTokens());
    navigate('/tutor-signin');
  };

  const navigationLinks = [
    { title: 'Find a tutor', href: '/home' },
    { title: 'Become a tutor', href: '/become-a-tutor' },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <img
              onClick={() => navigate('/become-a-tutor')}
              src="/src/assets/logo.webp"
              className="h-8 w-auto cursor-pointer"
              alt="SpeakIn Logo"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {!isAuthenticated && (
              <div className="flex space-x-8">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                {/* Credits Section with Buy Button */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
                    <CreditCard className="h-4 w-4" />
                    <span>{credits} Credits</span>
                  </div>
                </div>

                {/* Notifications */}
                <button
                  onClick={() => navigate('/notifications')}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <User className="h-5 w-5" />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="py-1 divide-y divide-gray-100">
                        <div className="px-4 py-2">
                          <p className="text-sm font-medium text-gray-900">My Account</p>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => {
                              navigate('/tutor-profile');
                              setIsDropdownOpen(false);
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </button>
                          <button
                            onClick={() => {
                              navigate('/settings');
                              setIsDropdownOpen(false);
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </button>
                        </div>
                        <div className="py-1">
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
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/tutor-signin')}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-2 pb-3 space-y-2">
            {!isAuthenticated ? (
              <>
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                ))}
                <button 
                  className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    navigate('/tutor-signin');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <div className="px-3 py-2 space-y-2">
                  <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm inline-flex">
                    <CreditCard className="h-4 w-4" />
                    <span>{credits} Credits</span>
                  </div>
                </div>
                <button
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => {
                    navigate('/tutor-profile');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </button>
                <button
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => {
                    navigate('/notifications');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </button>
                <button
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TutorNavbar;