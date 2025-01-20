import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const Avatar = ({ src, name, size = 64, isNavbar = false, isUploading = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(!!src);

  useEffect(() => {
    if (src) {
      setIsLoading(true);
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageLoaded(true);
        setIsLoading(false);
      };
      img.onerror = () => {
        setImageError(true);
        setIsLoading(false);
      };
    }
    
    return () => {
      setImageLoaded(false);
      setImageError(false);
      setIsLoading(!!src);
    };
  }, [src]);

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';
  };

  const getRandomColor = (name) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
    ];
    
    const index = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[index % colors.length];
  };

  // Show loading spinner when image is loading or uploading
  if ((isLoading && isNavbar) || isUploading) {
    return (
      <div 
        className={`${isNavbar ? 'bg-white/10' : 'bg-gray-100'} rounded-full flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <LoadingSpinner 
          size={isNavbar ? "sm" : "md"} 
          className={isNavbar ? "text-white" : "text-blue-600"} 
        />
      </div>
    );
  }

  // Only show initials if there's no image or if image failed to load
  if (!src || imageError) {
    return (
      <div 
        className={`${getRandomColor(name)} rounded-full flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-medium" style={{ fontSize: size * 0.4 }}>
          {getInitials(name)}
        </span>
      </div>
    );
  }

  // Show image with loading state
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <img
        src={src}
        alt={name}
        className={`w-full h-full rounded-full object-cover transition-opacity duration-200 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default Avatar;