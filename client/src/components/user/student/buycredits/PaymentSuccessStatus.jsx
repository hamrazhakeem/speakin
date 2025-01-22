import React, { useState, useEffect } from 'react';
import { CheckCircle, Home } from 'lucide-react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateCredits } from '../../../../redux/authSlice';
import useAxios from '../../../../hooks/useAxios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { studentApi } from '../../../../api/studentApi';
import PrimaryButton from '../../common/ui/buttons/PrimaryButton';

const PaymentSuccessStatus = () => {
  const [searchParams] = useSearchParams();
  const { credits, userId } = useSelector(state => state.auth);
  const [updatedCredits, setUpdatedCredits] = useState(credits);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const amount = queryParams.get('amount');
  const purchasedCredits = queryParams.get('credits');
  const dispatch = useDispatch();
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpdatedCredits = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
          throw new Error('No session ID found');
        }

        const response = await studentApi.getUser(axiosInstance, userId);
        const newCredits = response.balance_credits;

        dispatch(updateCredits(newCredits));
        setUpdatedCredits(newCredits);
      } catch (error) {
        console.error('Error fetching updated credits:', error);
        navigate('/home');
      }
    };

    fetchUpdatedCredits();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="flex-1 bg-gray-50">
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md mt-10 mb-10"> 
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="text-gray-500 mt-2">Your credits have been added to your account</p>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-500">
                <span>Amount Paid</span>
                <span>₹{amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Credits Purchased</span>
                <span>{purchasedCredits?.toLocaleString()} credits</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Transaction Date</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Credit Balance</span>
                <AnimatePresence>
                  <motion.span
                    key={updatedCredits}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                    layout
                  >
                    {updatedCredits}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Return Home Button */}
          <div className="space-y-4">
            <PrimaryButton
              onClick={() => navigate('/home')}
              showChevron={false}
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </PrimaryButton>
          </div>

          {/* Success Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Transaction completed successfully
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessStatus;