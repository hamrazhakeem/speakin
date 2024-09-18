import React, { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign up submitted', { name, email, password, code });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex justify-center items-center p-4 mt-16 md:mt-24 mb-10">
        <div className="w-full max-w-md text-center">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">SpeakIn ID</h2>
            <p className="text-gray-600 text-sm md:text-base">Create your SpeakIn Account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="text-sm md:text-base text-gray-600">Have a code for free trial? Enter below</p>
            <input
              type="text"
              placeholder="Code"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Sign Up
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage;
