import React from 'react';
import { Ban, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PaymentCancelPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Main content with proper spacing for fixed navbar */}
      <main className="flex-grow bg-gray-50 pt-16">
        <div className="min-h-[calc(100vh-13rem)] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ban className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Failed</h2>
              <p className="text-gray-500 mt-2">Your transaction could not be completed</p>
            </div>

            {/* Message Box */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="space-y-4">
                <p className="text-gray-600 text-center">
                  We were unable to process your payment. This could happen due to:
                </p>
                <ul className="text-gray-500 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    <span>Insufficient funds</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    <span>Card verification failed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    <span>Transaction timeout</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Return Home Button */}
            <div className="relative group">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
              <Link 
                to="/"
                className="relative w-full px-8 py-4 bg-[#6772E5] text-white border border-[#6772E5] hover:bg-white hover:text-[#6772E5] rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group-hover:shadow-xl"
              >
                <Home className="w-5 h-5 text-white group-hover:text-[#6772E5] transition-colors duration-300" />
                <span className="font-medium text-white group-hover:text-[#6772E5] transition-colors duration-300">
                  Return to Home
                </span>
              </Link>
            </div>

            {/* Support Note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Need help? Contact our support team
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentCancelPage;