import React from 'react';

const GradientButton = ({ 
  onClick, 
  disabled, 
  isLoading, 
  children,
  className = "",
  loadingText = "Processing..."
}) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
      <button 
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`relative w-full px-6 sm:px-8 py-3 sm:py-4 bg-[#6772E5] text-white border border-[#6772E5] hover:bg-white hover:text-[#6772E5] rounded-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group-hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? (
          <div className="h-5 flex items-center gap-2">
            <span>{loadingText}</span>
          </div>
        ) : children}
      </button>
    </div>
  );
};

export default GradientButton;