import React from 'react';
import AdminSidebarItem from './AdminSidebarItem';

const AdminSidebar = ({ items }) => (
    <div className="w-64 bg-white shadow-lg rounded-2xl m-4 overflow-hidden">
      {items.map((item, index) => (
        <AdminSidebarItem key={index} label={item.label} active={item.active} />
      ))}
    </div>
);

export default AdminSidebar;