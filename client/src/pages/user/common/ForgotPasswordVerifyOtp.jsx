import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/user/common/Navbar';
import Footer from '../../../components/user/common/Footer';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Shield, Timer } from 'lucide-react';

const ForgotPasswordVerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email, cache_key } = location.state || {};

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(() => {
        // Check if user is coming from forgot-password page
        const prevPath = localStorage.getItem('prevPath');
        const currentPath = location.pathname;
        
        if (prevPath !== currentPath) {
            localStorage.setItem('prevPath', currentPath);
            localStorage.setItem('otpTimerEnd', (Date.now() + 30 * 1000).toString());
            return 30;
        }

        const endTime = localStorage.getItem('otpTimerEnd');
        if (endTime) {
            const remaining = Math.round((parseInt(endTime) - Date.now()) / 1000);
            return remaining > 0 ? remaining : 0;
        }
        return 30;
    });
    const [showTimer, setShowTimer] = useState(timer > 0);

    useEffect(() => {
        if (!email || !cache_key) {
            navigate('/forgot-password');
            return;
        }
    }, [email, cache_key, navigate]);

    useEffect(() => {
        if (timer > 0) {
            // Store end time in localStorage
            localStorage.setItem('otpTimerEnd', (Date.now() + timer * 1000).toString());

            const interval = setInterval(() => {
                setTimer((prevTimer) => {
                    const newTimer = prevTimer - 1;
                    if (newTimer === 0) {
                        localStorage.removeItem('otpTimerEnd');
                        setShowTimer(false);
                    }
                    return newTimer;
                });
            }, 1000);
            return () => {
                clearInterval(interval);
            };
        } else {
            setShowTimer(false);
            localStorage.removeItem('otpTimerEnd');
        }
    }, [timer]);

    // Clean up when component unmounts
    useEffect(() => {
        return () => {
            localStorage.removeItem('prevPath');
        };
    }, []);

    const handleOtpChange = (index, value, e) => {
        // Handle pasting
        const pastedData = e?.clipboardData?.getData('Text');
        if (pastedData) {
            e.preventDefault();
            const pastedDigits = pastedData
                .slice(0, 6)
                .split('')
                .filter(char => /^\d$/.test(char));

            const newOtp = [...otp];
            pastedDigits.forEach((digit, idx) => {
                if (idx < 6) {
                    newOtp[idx] = digit;
                }
            });
            setOtp(newOtp);

            // Focus last input if all filled, or next empty input
            const nextEmptyIndex = newOtp.findIndex(digit => !digit);
            const targetIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
            document.querySelector(`input[name=otp-${targetIndex}]`)?.focus();
            return;
        }

        // Handle single digit input
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            // Focus previous input on backspace if current input is empty
            const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setVerifyLoading(true);

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter the complete 6-digit OTP.');
            setVerifyLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}forgot-password-verify-otp/`, 
                { email, otp: otpString, cache_key }
            );
            console.log('OTP verified successfully:', response.data);
            toast.success('OTP verified successfully!');
            navigate('/forgot-password/set-new-password', { state: { email, cache_key } });
        } catch (error) {
            console.error(error.response?.data);
            setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setResendLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}forgot-password-resend-otp/`, 
                { email, cache_key }
            );
            console.log('OTP resent successfully:', response.data);
            toast.success('New OTP sent to your email!');
            setTimer(30);
            setShowTimer(true);
            localStorage.setItem('otpTimerEnd', (Date.now() + 30 * 1000).toString());
            setOtp(['', '', '', '', '', '']); // Clear OTP fields
        } catch (error) {
            console.error(error.response?.data);
            setError(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-1 flex justify-center items-center p-4 mt-16 md:mt-24 mb-10">
                <div className="w-full max-w-md">
                    {/* Back Link */}
                    <Link 
                        to="/forgot-password" 
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Forgot Password
                    </Link>

                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {/* Icon Header */}
                        <div className="flex justify-center mb-6">
                            <div className="p-3 bg-blue-50 rounded-full">
                                <Shield className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>

                        {/* Header Text */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Verify OTP</h2>
                            <p className="text-gray-600">
                                Enter the 6-digit code sent to<br />
                                <span className="font-medium text-gray-900">{email}</span>
                            </p>
                        </div>

                        {/* OTP Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex justify-center gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        name={`otp-${index}`}
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onPaste={(e) => handleOtpChange(index, '', e)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                ))}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={verifyLoading}
                                className="w-full h-12 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center group"
                            >
                                {verifyLoading ? (
                                    <div className="h-5 flex items-center">
                                        <LoadingSpinner size="sm"/>
                                    </div>
                                ) : (
                                    <>
                                        Verify OTP
                                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start">
                                    <span className="shrink-0 mr-2">⚠️</span>
                                    {error}
                                </div>
                            )}
                        </form>

                        {/* Resend OTP Section */}
                        <div className="mt-6 text-center">
                            {showTimer ? (
                                <div className="flex items-center justify-center text-gray-600">
                                    <Timer className="w-4 h-4 mr-2" />
                                    Resend OTP in {timer} seconds
                                </div>
                            ) : (
                                <div className="flex justify-center">
                                    <button
                                        onClick={handleResendOtp}
                                        disabled={resendLoading}
                                        className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                                    >
                                        {resendLoading ? (
                                            <LoadingSpinner size="sm" className="text-blue-600" />
                                        ) : (
                                            'Resend OTP'
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ForgotPasswordVerifyOtp;
