import React from 'react';
import PropTypes from 'prop-types';

const LogoBadge = ({
  icon: Icon,
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="bg-black border border-zinc-800 rounded-2xl p-3 mb-4">
        <Icon className="w-8 h-8 text-white" />
      </div>
      {title && <h1 className="text-2xl font-bold text-white">{title}</h1>}
      {subtitle && <p className="text-zinc-400 mt-2">{subtitle}</p>}
    </div>
  );
};

LogoBadge.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.string,
};

export default LogoBadge;
