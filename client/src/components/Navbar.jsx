import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed w-full z-20 top-0 start-0 border-b border-gray-200 bg-white/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <img onClick={() => navigate('/')} src="/src/assets/logo.webp" className="h-8 w-auto sm:h-10 md:h-12 lg:h-12 hover:cursor-pointer" alt="SpeakIn Logo" />

        <div className="flex items-center space-x-4 md:space-x-8">
          <ul className="hidden md:flex md:space-x-8 font-medium">
            <li>
              <a
                href="#"
                className="text-gray-900 hover:text-[#007AFF] px-3 py-2 rounded md:p-0"
              >
                Find a tutor
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-900 hover:text-[#007AFF] px-3 py-2 rounded md:p-0"
              >
                Become a tutor
              </a>
            </li>
          </ul>
          
          <button
            type="button"
            className="text-white bg-[#007AFF] hover:bg-[#0066CC] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 font-medium rounded-lg text-sm px-4 py-2 text-center"
            onClick={() => navigate('/signin')}
          >
            Sign In
          </button>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
