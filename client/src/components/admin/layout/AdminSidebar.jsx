import React from 'react';
import { Home, Languages, Users, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminButton from '../ui/AdminButton';

const AdminSidebar = ({ items, isOpen, onClose }) => {
  const navigate = useNavigate(); // React Router hook for navigation

  // Define the available icons and paths
  const icons = {
    Dashboard: <Home className="h-5 w-5" />,
    'Users': <Users className="h-5 w-5" />,
    Sessions: <Video className="h-5 w-5" />,
    Languages: <Languages className="h-5 w-5" />,
  };

  const paths = {
    Dashboard: '/admin/dashboard',
    'Users': '/admin/manage-users',
    Sessions: '/admin/manage-sessions',
    Languages: '/admin/manage-languages',
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed lg:sticky top-16 inset-y-0 left-0 z-50
          w-48 h-[calc(100vh-4rem)] bg-black border-r border-zinc-800 
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
          lg:z-30
        `}
      >
        <div className="flex flex-col h-full">
          <div className="sticky top-0 bg-black z-10 p-6 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-white">Admin Portal</h2>
            <p className="text-sm text-zinc-400">Manage your platform</p>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {items.map((item, index) => {
              const icon = icons[item.label]; // Get the icon based on label
              const path = paths[item.label]; // Get the path based on label

              return (
                <AdminButton
                  key={index}
                  onClick={() => navigate(path)} // Navigate to the specified path
                  variant="sidebar"
                  active={item.active}
                  fullWidth
                  className="flex items-center gap-3"
                >
                  {icon}
                  <span>{item.label}</span>
                </AdminButton>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
