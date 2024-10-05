import React from "react";

const AdminSidebarItem = ({ label, active }) => (
    <div className={`py-3 px-6 ${active ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'} cursor-pointer`}>
      {label}
    </div>
);

export default AdminSidebarItem;