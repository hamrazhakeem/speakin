import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6 w-full h-32 flex items-center">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center h-full">
        <span className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
          &copy; 2024 SpeakIn. All rights reserved.
        </span>
        <div className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6">
          <a href="#" className="text-gray-600 hover:text-gray-900">Contact SpeakIn</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Refer a Friend</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">About Us</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">How it Works</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Become a Tutor</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
