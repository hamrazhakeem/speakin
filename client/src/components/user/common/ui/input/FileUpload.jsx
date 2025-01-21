import React, { forwardRef } from 'react';

const FileUpload = forwardRef(({ onChange, accept, label, error }, ref) => (
  <div className="space-y-2">
    <label className="font-medium block text-gray-700">{label}</label>
    <div className="relative">
      <input
        type="file"
        onChange={onChange}
        accept={accept}
        ref={ref}
        className="w-full p-3 border-2 border-dashed rounded-lg focus:ring-2 outline-none border-gray-300 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
));

export default FileUpload;