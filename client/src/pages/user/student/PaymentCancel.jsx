import React from 'react';
import { Ban, Home, RefreshCcw, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/user/common/Navbar';
import Footer from '../../../components/user/common/Footer';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-16">
        <div className="min-h-[calc(100vh-13rem)] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ban className="w-8 h-8 text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Not Completed</h2>
              <p className="text-gray-500 mt-2">Your transaction was cancelled</p>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-medium text-gray-900 mb-4">What would you like to do?</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/buy-credits')}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition duration-200"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Try Payment Again
                </button>

                <button 
                  onClick={() => navigate('/')}
                  className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition duration-200"
                >
                  <Home className="w-5 h-5" />
                  Return to Home
                </button>
              </div>
            </div>

            {/* Help Box */}
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                Having trouble with payment? Our support team is here to help.{' '}
                <button 
                  onClick={() => navigate('/support')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Contact Support
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentCancel;