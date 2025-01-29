import React, { forwardRef } from 'react';
import { toast } from 'react-hot-toast';

const FileUpload = forwardRef(({ onChange, accept, label, error, maxSize = 5, value, ...props }, ref) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      onChange(e);
      return;
    }

    // Validate image files
    if (accept === 'image/*' || accept === '.jpg,.jpeg,.png') {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const validExtensions = ['jpg', 'jpeg', 'png'];
      const extension = file.name.split('.').pop().toLowerCase();

      if (!allowedTypes.includes(file.type) || !validExtensions.includes(extension)) {
        toast.error('Please upload only JPG or PNG images');
        e.target.value = null;
        return;
      }
    }

    // Validate video files
    if (accept === 'video/*') {
      if (!file.type.startsWith('video/')) {
        toast.error('Please upload a valid video file');
        e.target.value = null;
        return;
      }
    }

        // Check file size (default 5MB)
        if (file.size > maxSize * 1024 * 1024) {
          toast.error(`File size should be less than ${maxSize}MB`);
          e.target.value = null;
          return;
        }

    // If all validations pass, call the original onChange with the event
    onChange(e);
  };

  return (
    <div className="space-y-2">
      <label className="font-medium block text-gray-700">{label}</label>
      <div className="relative">
        <input
          type="file"
          onChange={handleFileChange}
          accept={accept}
          ref={ref}
          className="w-full p-3 border-2 border-dashed rounded-lg focus:ring-2 outline-none border-gray-300 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      <p className="text-sm text-gray-500">
        {(accept === 'image/*' || accept === '.jpg,.jpeg,.png')
          ? 'Accepted formats: JPG, PNG (Max size: 5MB)'
          : accept === 'video/*'
          ? 'Accepted formats: MP4, WebM, etc. (Max size: 100MB)'
          : 'Please select a file'}
      </p>
    </div>
  );
});

export default FileUpload;