import React, { forwardRef } from 'react';

const InputField = forwardRef(({ error, ...props }, ref) => (
  <div className="relative">
    <input
      {...props}
      ref={ref}
      className={`w-full p-3 border-2 rounded-lg transition-all duration-200 focus:ring-2 outline-none ${
        error 
          ? 'border-red-300 focus:ring-red-100' 
          : 'border-gray-200 focus:ring-blue-100 focus:border-blue-400'
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
));

export default InputField;