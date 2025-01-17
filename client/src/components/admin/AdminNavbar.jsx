import React, { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { clearTokens } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Avatar from '../common/Avatar';

const AdminNavbar = ({ children }) => {
  const { userName } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    dispatch(clearTokens());
    navigate('/admin/sign-in');
  };

  return (
    <nav className="fixed w-full z-40 top-0 bg-black border-b border-zinc-800">
      <div className="max-w-full px-4 mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and mobile menu */}
          {children}

          {/* Right side - User menu */}
          <div className="flex items-center gap-6">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <Avatar name={userName} size={32} />
                <span className="text-sm font-medium text-white">{userName}</span>
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg bg-black border border-zinc-800 py-1 shadow-lg">
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