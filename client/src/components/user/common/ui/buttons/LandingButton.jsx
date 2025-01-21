import React from 'react';
import { ChevronRight } from 'lucide-react';

const LandingButton = ({ 
  children, 
  onClick, 
  variant = 'primary', // 'primary' or 'white'
  className = '',
  icon: Icon,
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-medium transition-all duration-200 group";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30",
    white: "bg-white text-blue-600 hover:bg-gray-50 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
    </button>
  );
};

export default LandingButton;