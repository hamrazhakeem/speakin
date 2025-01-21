import React, { useState } from 'react';
import { CreditCard, Wallet, Info } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import useAxios from '../../../../hooks/useAxios';
import { useSelector } from 'react-redux';
import CreditAmountSelector from '../../common/ui/credits/CreditAmountSelector';
import GradientButton from '../../common/ui/buttons/GradientButton';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PK}`);

const CreditPurchaseForm = () => {
    const userId = useSelector((state) => state.auth.userId);
    const [credits, setCredits] = useState(1);
    const [inputValue, setInputValue] = useState('1');
    const [isLoading, setIsLoading] = useState(false);
    const pricePerCredit = 150;
    const axiosInstance = useAxios();

    const handleCheckout = async () => {
        try {
            setIsLoading(true);
            const stripe = await stripePromise;
            if (!stripe) throw new Error('Stripe failed to initialize');

            const response = await axiosInstance.post(`${import.meta.env.VITE_API_GATEWAY_URL}create-checkout-session/`, {
                user_id: userId,
                amount: credits * pricePerCredit,
                transaction_type: 'credit_purchase',
                status: 'pending',
                purchased_credits: credits,
                price_per_credit: pricePerCredit,
                currency: 'inr',
            });

            const { session_id } = response.data;
            if (!session_id) {
                throw new Error('Failed to create checkout session');
            }

            const result = await stripe.redirectToCheckout({ sessionId: session_id });
            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 min-h-[calc(100vh-4rem-4rem)]">
            <div className="w-full sm:max-w-[400px] lg:max-w-[450px]">
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-100 mt-10 mb-10">
                    {/* Header */}
                    <div className="flex justify-center mb-4 sm:mb-6">
                        <div className="p-2 sm:p-3 bg-blue-50 rounded-full">
                            <Wallet className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-blue-600" />
                        </div>
                    </div>
                    
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-1 sm:mb-2">Buy Credits</h1>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 text-center mb-6 sm:mb-8">Purchase credits to book language sessions</p>

                    {/* Credit Selection */}
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div>
                                <span className="text-sm sm:text-base text-gray-900 font-medium">Credits</span>
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">₹{pricePerCredit} per credit</div>
                            </div>
                            
                            <CreditAmountSelector 
                                credits={credits}
                                setCredits={setCredits}
                                inputValue={inputValue}
                                setInputValue={setInputValue}
                                isLoading={isLoading}
                            />
                        </div>

                        {/* Total Calculation */}
                        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4">
                            <div className="flex justify-between items-center text-base sm:text-lg">
                                <span className="font-medium text-gray-900">Total Amount</span>
                                <span className="font-semibold text-gray-900">₹{(credits * pricePerCredit).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                        <div className="flex gap-2 sm:gap-3">
                            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs sm:text-sm text-blue-800">
                                <p className="font-medium mb-1 sm:mb-2">About Credits</p>
                                <ul className="space-y-0.5 sm:space-y-1">
                                    <li>• Credits can be used for any future sessions</li>
                                    <li>• Unused credits are eligible for withdrawal</li>
                                    <li>• Book sessions with any available tutor</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Purchase Button */}
                    <GradientButton
                        onClick={handleCheckout}
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-[#6772E5] transition-colors duration-300" />
                        <span className="text-sm sm:text-base font-medium text-white group-hover:text-[#6772E5] transition-colors duration-300">
                            Pay ₹{(credits * pricePerCredit).toLocaleString()} with Stripe
                        </span>
                    </GradientButton>

                    {/* Security Note */}
                    <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                        Secure payment processing
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditPurchaseForm;