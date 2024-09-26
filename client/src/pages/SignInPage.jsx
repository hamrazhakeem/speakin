import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign in submitted', { email, password });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex justify-center items-center p-4 mt-16 md:mt-24 mb-10">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">SpeakIn ID</h1>
          <p className="text-gray-600 mb-6 text-sm md:text-base">Sign In to your SpeakIn Account</p>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="email"
              placeholder="Email"
              required
              className="mb-4 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="mb-4 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Sign In
            </button>
          </form>
          <div className="flex flex-col space-y-2 mt-4">
            <button
              onClick={() => navigate('/signup')}
              className="text-blue-500 border border-blue-500 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 rounded px-4 py-2 text-sm font-medium"
            >
              Create your SpeakIn ID
            </button>
            <Link to="/forgot-password" className="text-blue-500 hover:underline focus:outline-none">
              Forgotten your password?
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignInPage;
