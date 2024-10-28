import React, { useState } from "react";
import { LogOut, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { clearTokens } from "../redux/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
    const { userName } = useSelector((state) => state.auth);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        toast.success("Logged out successfully!")
        dispatch(clearTokens());
        navigate('/admin/signin'); 
    };
  
    return (
        <div className="bg-white shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/src/assets/logo.webp" alt="SpeakUp Logo" className="h-12 mr-3 rounded" />
          </div>
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span>{userName}</span>
              <ChevronDown size={20} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full" onClick={handleLogout}>
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      );
    };
    

export default AdminNavbar