import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Shield, Timer } from 'lucide-react';

const ForgotPasswordOtpPage = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array for 6 digits
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const [showTimer, setShowTimer] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const { email, cache_key } = location.state || {};

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setShowTimer(false);
        }
    }, [timer]);

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
        setLoading(true);

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter the complete 6-digit OTP.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}forgot-password-verify-otp/`, 
                { email, otp: otpString, cache_key }
            );
            console.log('OTP verified successfully:', response.data);
            toast.success('OTP verified successfully!');
            navigate('/set-new-password', { state: { email, cache_key } });
        } catch (error) {
            console.error(error.response?.data);
            setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}forgot-password-resend-otp/`, 
                { email, cache_key }
            );
            console.log('OTP resent successfully:', response.data);
            toast.success('New OTP sent to your email!');
            setTimer(30);
            setShowTimer(true);
            setOtp(['', '', '', '', '', '']); // Clear OTP fields
        } catch (error) {
            console.error(error.response?.data);
            setError(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
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

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start">
                                    <span className="shrink-0 mr-2">⚠️</span>
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Verify OTP
                                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Resend OTP Section */}
                        <div className="mt-6 text-center">
                            {showTimer ? (
                                <div className="flex items-center justify-center text-gray-600">
                                    <Timer className="w-4 h-4 mr-2" />
                                    Resend OTP in {timer} seconds
                                </div>
                            ) : (
                                <button
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                    className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ForgotPasswordOtpPage;
