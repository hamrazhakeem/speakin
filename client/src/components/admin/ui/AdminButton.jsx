import React from 'react';
import LoadingSpinner from '../../common/LoadingSpinner';

const AdminButton = ({ 
  type = 'button',
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  children,
  onClick,
  fullWidth = false,
  variant = 'primary', // primary, secondary, danger, sidebar, tab
  size = 'md', // sm, md, lg
  active = false, // for sidebar and tab variants
  className = '', // allow custom classes
}) => {
  const baseStyles = "rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg"
  };

  const variantStyles = {
    primary: "bg-white hover:bg-zinc-100 text-black",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    sidebar: active 
      ? "bg-white text-black hover:bg-zinc-100" 
      : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
    tab: active
      ? "bg-zinc-800 text-white"
      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
  };

  const widthClass = fullWidth ? "w-full" : "";
  const variantClass = variantStyles[variant];
  const sizeClass = variant === 'sidebar' ? 'px-4 py-3 text-sm' : sizeStyles[size];

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <LoadingSpinner 
            size="sm" 
            className={variant === 'primary' || (variant === 'sidebar' && active) ? 'text-black' : 'text-white'} 
          />
          <span>{loadingText}</span>
        </div>
      ) : children}
    </button>
  );
};

export default AdminButton;
