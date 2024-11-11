import React from 'react';
import { CreditCard, Minus, Plus } from 'lucide-react';
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
    const [inputValue, setInputValue] = useState('1');  // New state for input value
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
          
          {/* Main content with proper spacing for fixed navbar */}
          <main className="flex-grow bg-gray-50 pt-16">
            <div className="min-h-[calc(100vh-13rem)] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
                {/* Header */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600 font-medium">Amount of Credits</span>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={decrementCredits}
                        disabled={isLoading}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-[#6772E5] hover:text-[#6772E5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        disabled={isLoading}
                        className="font-semibold text-lg w-20 text-center bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#6772E5] focus:ring-1 focus:ring-[#6772E5] disabled:opacity-50"
                        placeholder="1"
                      />
    
                      <button 
                        onClick={incrementCredits}
                        disabled={isLoading}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-[#6772E5] hover:text-[#6772E5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
    
                  {/* Price Calculation */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-500">
                      <span>Price per credit</span>
                      <span>₹{pricePerCredit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Number of credits</span>
                      <span>× {credits.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount</span>
                      <span>₹{(credits * pricePerCredit).toLocaleString()}</span>
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