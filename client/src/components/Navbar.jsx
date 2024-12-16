import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Bell, User, Menu, X, CreditCard, LogOut, Settings, Plus, MessageCircle } from 'lucide-react';
import { clearTokens, updateCredits } from '../redux/authSlice';
import useAxios from '../hooks/useAxios';
import Avatar from './Avatar';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, userId, credits, userName, isTutor } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const axiosInstance = useAxios();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`users/${userId}/`);
        if (response.data.balance_credits !== credits) {
          dispatch(updateCredits(response.data.balance_credits));
        }
        setProfileImage(response.data.profile_image);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isAuthenticated && userId) {
      fetchUserData();
    }
  }, [isAuthenticated, userId, dispatch, credits]);

  const handleLogout = () => {
    dispatch(clearTokens());
    navigate(isTutor ? '/tutor-sign-in' : '/sign-in');
  };

  const navigationLinks = [
    { title: 'Find a tutor', href: '/home' },
    { title: 'Become a tutor', href: '/become-a-tutor' },
  ];

  const getProfilePath = () => isTutor ? '/tutor-profile' : '/profile';
  const getSignInPath = () => isTutor ? '/tutor-sign-in' : '/sign-in';
  const getHomePath = () => isTutor ? '/become-a-tutor' : '/';

  const renderCreditsSection = () => (
    <div className="flex items-center space-x-2">
      <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
        <CreditCard className="h-4 w-4" />
        <span>{credits} Credits</span>
      </div>
      {/* Only show Buy Credits button for students */}
      {!isTutor && (
        <div className="relative group">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
          <button
            onClick={() => navigate('/buy-credits')}
            className="relative px-4 py-1 bg-[#6772E5] text-white border border-[#6772E5] hover:bg-white rounded-full transition-all duration-300 flex items-center justify-center gap-1 group-hover:shadow-xl"
          >
            <Plus className="h-3 w-3 text-white group-hover:text-[#6772E5] transition-colors duration-300" />
            <span className="text-sm font-medium text-white group-hover:text-[#6772E5] transition-colors duration-300">
              Buy
            </span>
          </button>
        </div>
      )}
    </div>
  );

  const renderDropdownMenu = () => (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="py-1 divide-y divide-gray-100">
        <div className="px-4 py-2">
          <p className="text-sm font-medium text-gray-900">My Account</p>
        </div>
        <div className="py-1">
          <button
            onClick={() => {
              navigate(getProfilePath());
              setIsDropdownOpen(false);
            }}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </button>
          {/* Add other menu items conditionally */}
          {!isTutor && (
            <button
              onClick={() => {
                navigate('/buy-credits');
                setIsDropdownOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Buy Credits
            </button>
          )}
          {/* Common menu items */}
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
  );

  return (
    <nav className="fixed w-full z-50 top-0 border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <img
              onClick={() => navigate(getHomePath())}
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
                {/* Credits Section */}
                {renderCreditsSection()}
  
                {/* Subscribe Button - Only for students */}
                {!isTutor && (
                  <button
                    onClick={() => navigate('/subscribe')}
                    className="hidden lg:flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Subscribe to SpeakIn+
                  </button>
                )}
  
                {/* Messages */}
                <button
                  onClick={() => navigate('/messages')}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                </button>
  
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
                    <Avatar
                      src={profileImage} 
                      name={userName || ''} 
                      size={36} 
                    />
                  </button>
  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && renderDropdownMenu()}
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate(getSignInPath())}
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
              ) : isAuthenticated ? (
                <Avatar 
                  src={profileImage} 
                  name={userName || ''} 
                  size={36} 
                />
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
                    navigate(getSignInPath());
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
                  {!isTutor && (
                    <button
                      onClick={() => {
                        navigate('/buy-credits');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      Buy Credits
                    </button>
                  )}
                </div>
                
                {!isTutor && (
                  <button
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      navigate('/subscribe');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Subscribe to SpeakIn+
                  </button>
                )}
  
                <button
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => {
                    navigate(getProfilePath());
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </button>
  
                <button
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => {
                    navigate('/messages');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Messages
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

export default Navbar;