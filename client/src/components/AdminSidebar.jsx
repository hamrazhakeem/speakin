import React from 'react';
import { Home, Users, Video } from 'lucide-react';

const AdminSidebar = ({ items, isOpen, onClose }) => {
  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: "Dashboard", active: false },
    { icon: <Users className="h-5 w-5" />, label: "Manage Users", active: true },
    { icon: <Video className="h-5 w-5" />, label: "Sessions", active: false },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}
      
      <div className={`
        fixed lg:sticky top-16 inset-y-0 left-0 z-30
        w-64 h-[calc(100vh-4rem)] bg-black border-r border-zinc-800
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="flex flex-col h-full">
          <div className="sticky top-0 bg-black z-10 p-6 border-b border-zinc-800">
            <h2 className="text-xl font-semibold text-white">Admin Portal</h2>
            <p className="text-sm text-zinc-400">Manage your platform</p>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item, index) => (
              <button
                key={index}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${item.active 
                    ? 'bg-white text-black' 
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }
                `}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;