import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowDownCircle, ArrowUpCircle, ChevronRight, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../common/ui/LoadingSpinner';
import useAxios from '../../../../hooks/useAxios';
import { useSelector, useDispatch } from 'react-redux';
import { updateCredits } from '../../../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../common/ui/buttons/PrimaryButton';
import GradientButton from '../../common/ui/buttons/GradientButton';
import CreditAmountSelector from '../../common/ui/credits/CreditAmountSelector';

const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200 ${className}`}>
        {children}
    </div>
    );

    const CardHeader = ({ children }) => (
    <div className="p-6 border-b border-gray-100">
        {children}
    </div>
    );

    const CardTitle = ({ children }) => (
    <h3 className="text-lg font-semibold text-gray-900">
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

const CreditsManagement = () => {
    const [credits, setCredits] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [balance_credits, setBalanceCredits] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isStripeConnecting, setIsStripeConnecting] = useState(false);
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
        setIsStripeConnecting(true);
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
        setIsStripeConnecting(false);
        }
    };

    const handleWithdraw = async () => {
        if (!credits || credits <= 0) {
        toast.error('Please enter a valid amount of credits');
        return;
        }
        if (isTutor && credits <= 10) {
        toast.error('Enter more than 10 credits to withdraw.');
        return;
        }
        if (credits > balance_credits) {
        toast.error('Insufficient credits');
        return;
        }

        try {
        setIsLoading(true);
        const response = await axiosInstance.post('withdraw/', {
            user_id: userId,
            balance_credits: balance_credits,
            credits: credits,
        });
        if (response.data) {
            setCredits(0);
            setInputValue('');
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
      <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-24 mt-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Credits & Withdrawals</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isTutor ? 'Convert your earned credits to real money through Stripe.' : 'Convert your credits to real money through Stripe.'}
          </p>

          {/* Button to navigate back */}
          <div className="max-w-sm mx-auto mt-6">
            <PrimaryButton
              onClick={() => navigate(isTutor ? '/tutor/dashboard' : '/profile')}
            >
              {isTutor ? 'Go to Dashboard' : 'Go to Profile'}
            </PrimaryButton>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`${isVerified ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
            <Card>
              <CardHeader>
                <CardTitle>Available Credits</CardTitle>
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
                  <GradientButton
                    onClick={handleConnectStripe}
                    loading={isStripeConnecting}
                    disabled={isStripeConnecting}
                    className="w-full"
                  >
                    {isStripeConnecting
                      ? 'Processing...'
                      : 'Connect with Stripe'}
                  </GradientButton>
                ) : (
                  <div className="space-y-4">
                    <CreditAmountSelector
                      credits={credits}
                      setCredits={setCredits}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      maxCredits={balance_credits}
                      isLoading={isLoading}
                    />

                    <GradientButton
                      onClick={handleWithdraw}
                      loading={isLoading}
                      disabled={!credits || isLoading || credits > balance_credits || credits <= 0}
                      className="w-full"
                    >
                      {isLoading
                        ? 'Processing...'
                        : `Withdraw ₹${credits ? (credits * 150).toLocaleString() : '0'}`}
                    </GradientButton>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {isVerified && (
            <div className="lg:col-span-2">
              <Card>
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
                    <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto scrollbar-thin rounded-lg">
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
    </div>
  )
}

export default CreditsManagement