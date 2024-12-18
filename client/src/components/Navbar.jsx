import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Bell, User, Menu, X, CreditCard, LogOut, Plus, MessageCircle, Star } from 'lucide-react';
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
    <div className="flex items-center space-x-3">
      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-100">
        <CreditCard className="h-4 w-4 text-blue-600" />
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
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black/5 border border-gray-100">
      <div className="py-1 divide-y divide-gray-50">
        <div className="px-4 py-3">
          <p className="text-sm font-medium text-gray-900">{userName}</p>
          <p className="text-xs text-gray-500 mt-1">{isTutor ? 'Tutor' : 'Student'}</p>
        </div>
        <div className="py-1">
          <button
            onClick={() => {
              navigate(getProfilePath());
              setIsDropdownOpen(false);
            }}
            className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <User className="mr-3 h-4 w-4 text-gray-500" />
            Profile
          </button>
          {!isTutor && (
            <button
              onClick={() => {
                navigate('/buy-credits');
                setIsDropdownOpen(false);
              }}
              className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <CreditCard className="mr-3 h-4 w-4 text-gray-500" />
              Buy Credits
            </button>
          )}
        </div>
        <div className="py-1">
          <button
            onClick={() => {
              handleLogout();
              setIsDropdownOpen(false);
            }}
            className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <nav className="fixed w-full z-50 top-0 border-b border-gray-100 bg-white/80 backdrop-blur-md">
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
          <div className="hidden md:flex md:items-center md:space-x-6">
            {!isAuthenticated && (
              <div className="flex space-x-8">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors relative group"
                  >
                    {link.title}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                ))}
              </div>
            )}
  
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                {renderCreditsSection()}
  
                {!isTutor && (
                  <button
                    onClick={() => navigate('/subscribe')}
                    className="hidden lg:flex items-center px-5 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 hover:border-gray-200 transition-all duration-200"
                  >
                    Subscribe to SpeakIn+
                  </button>
                )}
  
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate('/messages')}
                    className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors relative group"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {/* Add notification dot if needed */}
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                  </button>
  
                  <button
                    onClick={() => navigate('/notifications')}
                    className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors relative group"
                  >
                    <Bell className="h-5 w-5" />
                    {/* Add notification dot if needed */}
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                  </button>
  
                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center p-1.5 rounded-full border-2 border-transparent hover:border-gray-200 transition-colors"
                    >
                      <Avatar
                        src={profileImage}
                        name={userName || ''}
                        size={32}
                      />
                    </button>
  
                    {isDropdownOpen && renderDropdownMenu()}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate(getSignInPath())}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                Sign In
              </button>
            )}
          </div>
  
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : isAuthenticated ? (
                <Avatar
                  src={profileImage}
                  name={userName || ''}
                  size={32}
                />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
  
      {/* Mobile menu with updated styling */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-3 space-y-4">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <Avatar
                    src={profileImage}
                    name={userName || ''}
                    size={40}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{userName}</p>
                    <p className="text-sm text-gray-500">{isTutor ? 'Tutor' : 'Student'}</p>
                  </div>
                </div>

                {/* Credits Section */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 border border-gray-100">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span>{credits} Credits</span>
                  </div>
                  {!isTutor && (
                    <button
                      onClick={() => {
                        navigate('/buy-credits');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 rounded-xl border border-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-sm font-medium">Buy Credits</span>
                    </button>
                  )}
                </div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate('/messages');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    <MessageCircle className="h-5 w-5 mr-3" />
                    Messages
                  </button>
                  <button
                    onClick={() => {
                      navigate('/notifications');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    <Bell className="h-5 w-5 mr-3" />
                    Notifications
                  </button>
                  <button
                    onClick={() => {
                      navigate(getProfilePath());
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    <User className="h-5 w-5 mr-3" />
                    Profile
                  </button>
                  {!isTutor && (
                    <button
                      onClick={() => {
                        navigate('/subscribe');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                    >
                      <Star className="h-5 w-5 mr-3" />
                      Subscribe to SpeakIn+
                    </button>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Non-authenticated Menu */}
                <div className="space-y-2">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex w-full items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                    >
                      {link.title}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      navigate(getSignInPath());
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-200"
                  >
                    Sign In
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;