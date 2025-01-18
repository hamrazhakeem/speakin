import React from 'react';
import PropTypes from 'prop-types';

const AlertBox = ({
  icon: Icon,
  message,
  variant = 'info', // info, success, warning, error
  className = '',
}) => {
  const variantStyles = {
    info: 'bg-black border-zinc-800 text-zinc-400',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
  };

  return (
    <div className={`border rounded-xl p-4 flex items-start gap-3 ${variantStyles[variant]} ${className}`}>
      {Icon && <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />}
      <p className="text-sm">{message}</p>
    </div>
  );
};

AlertBox.propTypes = {
  icon: PropTypes.elementType,
  message: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  className: PropTypes.string,
};

export default AlertBox;
