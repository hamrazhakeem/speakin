import React from 'react';
import { Search, AlertCircle } from 'lucide-react';

const HomeEmptyState = ({ icon, title, description, className = "bg-gray-50" }) => {
  const Icon = icon === "search" ? Search : AlertCircle;
  
  return (
    <div className={`text-center py-12 rounded-xl ${className}`}>
      <div className="text-gray-400 mb-4">
        <Icon className="h-12 w-12 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default HomeEmptyState;