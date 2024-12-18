import React from 'react';
import AdminSidebarItem from './AdminSidebarItem';
import { XMarkIcon } from '@heroicons/react/24/outline';

const AdminSidebar = ({ items, isOpen, onClose }) => (
  <>
    {isOpen && (
      <div 
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-45"
        onClick={onClose}
      />
    )}
    
    <div className={`
      fixed lg:static
      inset-y-0 left-0
      w-64 bg-gray-800/50 backdrop-blur-lg
      transform transition-transform duration-300 ease-in-out z-50
      border-r border-white/10
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="lg:hidden flex justify-end p-4">
        <button 
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-1 p-2">
        {items.map((item, index) => (
          <AdminSidebarItem 
            key={index} 
            label={item.label} 
            active={item.active}
            onClick={() => {
              if (!item.active) {
                onClose();
              }
            }}
          />
        ))}
      </div>
    </div>
  </>
);

export default AdminSidebar;