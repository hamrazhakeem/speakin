import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';
import logoWhite from '../../../assets/logo-white.webp';

const AdminLayout = ({ children, showSidebar = true }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Define navigation items and set active state based on current path
  const navItems = [
    { label: 'Dashboard', active: location.pathname === '/admin/dashboard' },
    { label: 'Users', active: location.pathname === '/admin/manage-users' },
    { label: 'Sessions', active: location.pathname === '/admin/manage-sessions' },
    { label: 'Languages', active: location.pathname === '/admin/manage-languages' },
    { label: 'Reports', active: location.pathname === '/admin/manage-reports' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminNavbar>
        <div className="flex items-center gap-4">
          {showSidebar && (
            <button 
              className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}
          <img
            onClick={() => navigate('/admin/dashboard')}
            src={logoWhite}
            className="h-8 w-auto cursor-pointer"
            alt="SpeakIn Logo"
          />
        </div>
      </AdminNavbar>
      
      <div className="flex flex-col lg:flex-row pt-16">
        {showSidebar && (
          <AdminSidebar 
            items={navItems}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
        
        <main className="flex-1 w-full min-h-[calc(100vh-4rem)]">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;