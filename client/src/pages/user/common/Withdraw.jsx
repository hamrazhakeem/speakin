import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowDownCircle, ArrowUpCircle, ChevronRight, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../../components/user/common/Navbar';
import Footer from '../../../components/user/common/Footer';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import useAxios from '../../../hooks/useAxios';
import { useSelector, useDispatch } from 'react-redux';
import { updateCredits } from '../../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const TransactionItem = ({ transaction, isTutor }) => {
  const getStatusColor = (status) => {
    const statusColors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-blue-100 text-blue-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTransactionColor = (type) => ({
    credit_purchase: 'text-red-500',
    withdrawal: 'text-green-500',
    default: 'text-blue-500'
  }[type] || 'text-blue-500');

  const getTransactionIcon = (type) => {
    const color = getTransactionColor(type);
    const icons = {
      withdrawal: <ArrowDownCircle className={`w-6 h-6 ${color}`} />,
      credit_purchase: <ArrowUpCircle className={`w-6 h-6 ${color}`} />,
      platform_fee: <DollarSign className={`w-6 h-6 ${color}`} />
    };
    return icons[type] || <DollarSign className={`w-6 h-6 ${color}`} />;
  };

  const formatTransactionType = (type) => {
    if (type === 'withdrawal' && isTutor) return 'Credits Payout';
    if (type === 'withdrawal' && !isTutor) return 'Withdrawal';
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getAmountPrefix = (type) => ({
    credit_purchase: '-',
    withdrawal: '+',
    default: ''
  }[type] || '');

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        {getTransactionIcon(transaction.transaction_type)}
        <div>
          <p className="font-medium text-gray-900">
            {formatTransactionType(transaction.transaction_type)}
          </p>
          <div className="flex flex-col sm:flex-row sm:gap-2">
            <p className="text-sm text-gray-500">
              {new Date(transaction.transaction_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(transaction.transaction_date).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          {transaction.purchased_credits && (
            <p className="text-xs text-gray-500">
              Credits: {transaction.purchased_credits}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className={`font-medium ${getTransactionColor(transaction.transaction_type)}`}>
            {getAmountPrefix(transaction.transaction_type)}
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: transaction.currency || 'INR',
              minimumFractionDigits: 2
            }).format(transaction.amount)}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </span>
      </div>
    </div>
  );
};

const Withdraw = () => {
  const [credits, setCredits] = useState('');
  const [balance_credits, setBalanceCredits] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { userId, isTutor } = useSelector(state => state.auth);
  const axiosInstance = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const initializePage = async () => {
      await Promise.all([checkStripeAccount(), fetchTransactions()]);
      setIsPageLoading(false);
    };
    initializePage();
  }, []);

  const checkStripeAccount = async () => {
    try {
      const credits_response = await axiosInstance.get(`users/${userId}/`);
      setBalanceCredits(credits_response.data.balance_credits);
      const response = await axiosInstance.get(`stripe-account/${userId}/`);
      setIsVerified(response.data.isVerified);
      dispatch(updateCredits(credits_response.data.balance_credits));
    } catch (error) {
      setIsVerified(false);
      console.error('Error checking stripe account:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      const response = await axiosInstance.get(`transactions/${userId}/`);
      setTransactions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transaction history');
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const handleConnectStripe = async () => {
    try {
      setIsLoading(true);
      const email_response = await axiosInstance.get(`users/${userId}/`);
      const response = await axiosInstance.post('stripe-account/', {
        user_id: userId,
        email: email_response.data.email,
      });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error connecting Stripe account:', error);
      toast.error('Failed to connect Stripe account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!credits || isNaN(credits) || credits <= 0) {
      toast.error('Please enter a valid amount of credits');
      return;
    }
    if (isTutor && parseInt(credits) <= 10) {
      toast.error('Enter more than 10 credits to withdraw.');
      return;
    }
    if (parseInt(credits) > balance_credits) {
      toast.error('Insufficient credits');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.post('withdraw/', {
        user_id: userId,
        balance_credits: balance_credits,
        credits: parseInt(credits),
      });
      if (response.data) {
        setCredits('');
        toast.success(`Withdrawal successful! Amount: ₹${response.data.amount_inr} (USD ${response.data.amount_usd.toFixed(2)})`);
        fetchTransactions();
        checkStripeAccount();
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      const errorMessage = error.response?.data?.credits || 
                          error.response?.data?.error || 
                          error.message || 
                          'Withdrawal failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <LoadingSpinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Credits & Withdrawals</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isTutor ? 'Convert your earned credits to real money through Stripe.' : 'Convert your credits to real money through Stripe.'}
          </p>

          {/* Button to navigate back */}
          <div className="max-w-sm mx-auto mt-6">
            <button
              onClick={() => navigate(isTutor ? '/tutor/dashboard' : '/profile')}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span>{isTutor ? 'Go to Dashboard' : 'Go to Profile'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`${isVerified ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Available Credits</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold text-blue-600">{balance_credits}</p>
                  <p className="text-sm text-gray-500 mt-1">1 credit = ₹150</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Estimated value: {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 2,
                    }).format(balance_credits * 150)}
                  </p>
                </div>

                {!isVerified ? (
                  <div className="space-y-4">
                    {/* Gradient Effect Container */}
                    <div className="relative group">
                      {/* Gradient background effect */}
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>

                      {/* Button Container */}
                      <button
                        onClick={handleConnectStripe}
                        disabled={isLoading}
                        className="relative w-full px-8 py-4 bg-[#6772E5] text-white border border-[#6772E5] hover:bg-white hover:text-[#6772E5] rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group-hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {/* Loading or Text */}
                        {isLoading ? (
                          'Processing...'
                        ) : (
                          'Connect with Stripe'
                        )}
                        </button>
                    </div>  
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-4">
                      {/* Decrement Button */}
                      <button
                        onClick={() => setCredits((prev) => Math.max(0, prev - 1))}
                        disabled={isLoading || credits <= 0}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      {/* Input Field */}
                      <input
                        type="text"
                        value={credits}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) setCredits(value); // Allows only digits
                        }}
                        disabled={isLoading}
                        className="font-semibold text-lg w-20 text-center bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                        placeholder="0"
                      />

                      {/* Increment Button */}
                      <button
                        onClick={() => setCredits((prev) => Math.min(balance_credits, +prev + 1))}
                        disabled={isLoading || credits >= balance_credits}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="relative group">
                      {/* Gradient background effect */}
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>

                      {/* Button */}
                      <button
                        onClick={handleWithdraw}
                        disabled={!credits || isLoading || credits > balance_credits}
                        className="relative w-full px-8 py-4 bg-[#6772E5] text-white border border-[#6772E5] hover:bg-white hover:text-[#6772E5] rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group-hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {/* Text */}
                        <span className="font-medium text-white group-hover:text-[#6772E5] transition-colors duration-300">
                          {isLoading
                            ? 'Processing...'
                            : `Withdraw ₹${credits ? (credits * 150).toLocaleString() : '0'}`}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {isVerified && (
            <div className="lg:col-span-2">
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Transaction History</CardTitle>
                    <button 
                      onClick={fetchTransactions}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2"
                    >
                      Refresh
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingTransactions ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="md" className="text-blue-600" />
                    </div>
                  ) : transactions.length > 0 ? (
                    <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto rounded-lg">
                      {transactions.map((transaction) => (
                        <TransactionItem 
                          key={transaction.id} 
                          transaction={transaction}
                          isTutor={isTutor}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No transactions yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default Withdraw;