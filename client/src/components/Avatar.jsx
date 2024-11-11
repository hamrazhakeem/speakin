import React from 'react';

const Avatar = ({ src, name, size = 64 }) => {
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
    
    // Use the name to consistently get the same color for the same user
    const index = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[index % colors.length];
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop
          e.target.src = ''; // Clear the src to show the backup avatar
          e.target.classList.add('hidden');
          e.target.nextSibling?.classList.remove('hidden');
        }}
      />
    );
  }

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
};

export default Avatar;