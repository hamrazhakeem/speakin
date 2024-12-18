import React from "react";

const AdminSidebarItem = ({ label, active }) => (
  <div className={`
    py-3 px-6 rounded-lg transition-all duration-200
    ${active 
      ? 'bg-red-500/20 text-red-500 font-semibold' 
      : 'text-gray-400 hover:bg-white/5 hover:text-white'
    } 
    cursor-pointer
  `}>
    {label}
  </div>
);

export default AdminSidebarItem;