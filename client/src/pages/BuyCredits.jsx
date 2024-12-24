import React from 'react';
import { CreditCard, Minus, Plus, Wallet, Info } from 'lucide-react';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import useAxios from '../hooks/useAxios';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PK}`);
  
const BuyCredits = () => {
  const userId = useSelector((state) => state.auth.userId);
  const [credits, setCredits] = useState(1);
  const [inputValue, setInputValue] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const pricePerCredit = 150;
  const axiosInstance = useAxios();

  const incrementCredits = () => {
    const newValue = credits + 1;
    setCredits(newValue);
    setInputValue(newValue.toString());
  };
  
  const decrementCredits = () => {
    if (credits > 1) {
      const newValue = credits - 1;
      setCredits(newValue);
      setInputValue(newValue.toString());
    }
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value); // Always update input value

    // Only update credits if value is valid
    if (value === '') {
      setCredits(1); // Keep credits at 1 even when input is empty
    } else if (/^\d+$/.test(value)) {
      const numValue = parseInt(value);
      if (numValue >= 1) {
        setCredits(numValue);
      }
    }
  };
  
  const handleBlur = () => {
    if (!inputValue || parseInt(inputValue) < 1) {
      setCredits(1);
      setInputValue('1');
    }
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
    
      // Get Stripe instance
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');
      
      // Create checkout session using Django backend
      const response = await axiosInstance.post(`${import.meta.env.VITE_API_GATEWAY_URL}create-checkout-session/`, {
        user_id: userId,
        amount: credits * pricePerCredit,  
        transaction_type: 'credit_purchase', 
        status: 'pending', 
        purchased_credits: credits,  
        price_per_credit: pricePerCredit, 
        currency: 'inr', 
      });
    
      const data = response.data; 
    
      if (!data.session_id) {
        throw new Error('Failed to create checkout session');
      }
    
      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: data.session_id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

    } catch (error) {
      console.error('Checkout error:', error);
      // You might want to show an error notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-16">
        <div className="min-h-[calc(100vh-13rem)] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Buy Credits</h1>
              <p className="text-gray-600 mt-2">Purchase credits to book language sessions</p>
            </div>

            {/* Credit Selection */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-gray-900 font-medium">Credits</span>
                  <div className="text-sm text-gray-500 mt-1">₹{pricePerCredit} per credit</div>
                </div>
                <div className="flex items-center gap-4">
  <button 
    onClick={decrementCredits}
    disabled={isLoading}
    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Minus className="w-4 h-4" />
  </button>
  
  <input
    type="text"
    value={inputValue}
    onChange={(e) => {
      const value = e.target.value;
      if (/^\d*$/.test(value)) {
        handleInputChange(e); // Call the existing handler only if the input is numeric
      }
    }}
    onBlur={handleBlur}
    disabled={isLoading}
    className="font-semibold text-lg w-20 text-center bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
    placeholder="1"
  />

  <button 
    onClick={incrementCredits}
    disabled={isLoading}
    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Plus className="w-4 h-4" />
  </button>
</div>

              </div>

              {/* Total Calculation */}
              <div className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium text-gray-900">Total Amount</span>
                  <span className="font-semibold text-gray-900">₹{(credits * pricePerCredit).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">About Credits</p>
                  <ul className="space-y-1">
                    <li>• Credits can be used for any future sessions</li>
                    <li>• Unused credits are eligible for withdrawal</li>
                    <li>• Book sessions with any available tutor</li>
                  </ul>
                </div>
              </div>
            </div>

                {/* Purchase Button */}
                <div className="relative group">
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
                  
                  <button 
                    className="relative w-full px-8 py-4 bg-[#6772E5] text-white border border-[#6772E5] hover:bg-white hover:text-[#6772E5] rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group-hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleCheckout}
                    disabled={isLoading}
                  >
                    <CreditCard className="w-5 h-5 text-white group-hover:text-[#6772E5] transition-colors duration-300" />
                    <span className="font-medium text-white group-hover:text-[#6772E5] transition-colors duration-300">
                      {isLoading ? 'Processing...' : `Pay ₹${(credits * pricePerCredit).toLocaleString()} with Stripe`}
                    </span>
                  </button>
                </div>
    
                {/* Security Note */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Secure payment processing
                </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BuyCredits;