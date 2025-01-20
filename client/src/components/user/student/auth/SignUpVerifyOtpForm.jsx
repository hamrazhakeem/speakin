import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setTokens } from '../../../../redux/authSlice';
import { ChevronRight, ChevronLeft, Shield, Timer } from 'lucide-react';
import LoadingSpinner from '../../../common/ui/LoadingSpinner';

const SignUpVerifyOtpForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [email, setEmail] = useState('');
    const [cacheKey, setCacheKey] = useState('');
    const [error, setError] = useState('');
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(() => {
        // Check if user is coming from signup page
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
        const { email: emailFromSignUp, cache_key } = location.state || {};
        if (emailFromSignUp) {
            setEmail(emailFromSignUp);
        } else {
            navigate('/sign-up');
        }
        if (cache_key) {
            setCacheKey(cache_key);  
        } else {
            navigate('/sign-up');
        }
    }, [location.state]);

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
        const pastedData = e?.clipboardData?.getData('Text');
        if (pastedData) {
            e.preventDefault();
            const pastedDigits = pastedData
                .slice(0, 6)
                .split('')
                .filter(char => /^\d$/.test(char));

            const newOtp = [...otp];
            pastedDigits.forEach((digit, idx) => {
                if (idx < 6) newOtp[idx] = digit;
            });
            setOtp(newOtp);

            const nextEmptyIndex = newOtp.findIndex(digit => !digit);
            const targetIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
            document.querySelector(`input[name=otp-${targetIndex}]`)?.focus();
            return;
        }

        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.querySelector(`input[name=otp-${index + 1}]`)?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleVerifyOtp = async (e) => {
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
            const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}verify-otp/`, 
                { email, otp: otpString, cache_key: cacheKey }
            );
            const { access, refresh, name, id, credits } = response.data;

            dispatch(setTokens({ accessToken: access, refreshToken: refresh, userName: name, isAdmin: false, userId: id, isStudent: true, credits: credits }));
      
            toast.success(`Welcome, ${name}!`);

            setTimeout(() => {
                navigate('/home');
            }, 1500);
        } catch (error) {
            console.error(error.response?.data);
            setVerifyLoading(false);
            setTimeout(() => {
                toast.error(error.response?.data?.message || 'Failed to verify OTP. Please try again.')
            }, 500);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setResendLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}resend-otp/`, 
                { email, cache_key: cacheKey }
            );
            console.log('OTP resent successfully:', response.data);
            toast.success('New OTP sent to your email!');
            setTimer(30);
            setShowTimer(true);
            localStorage.setItem('otpTimerEnd', (Date.now() + 30 * 1000).toString());
            setOtp(['', '', '', '', '', '']);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP. Please try again.')
            console.error(error.response?.data);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="flex-1 flex justify-center items-center p-4 bg-gray-50 min-h-[calc(100vh-4rem-4rem)]">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mt-10 mb-10">
                    <div className="mb-6">
                        <button
                            onClick={() => navigate('/sign-up')}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="text-sm font-medium">Back to Sign Up</span>
                        </button>
                    </div>

                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-blue-50 rounded-full">
                            <Shield className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Verify OTP</h2>
                        <p className="text-gray-600">
                            Enter the 6-digit code sent to<br />
                            <span className="font-medium text-gray-900">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div className="flex justify-between gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    name={`otp-${index}`}
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value, e)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={(e) => handleOtpChange(index, '', e)}
                                    className="w-12 h-12 text-center text-xl font-semibold border rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-200"
                                />
                            ))}
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={verifyLoading}
                            className="w-full h-12 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center group"
                        >
                            {verifyLoading ? (
                                <div className="h-5 flex items-center gap-3">
                                    <LoadingSpinner size="sm"/>
                                </div>
                            ) : (
                                <>
                                    Verify OTP
                                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="flex justify-center items-center gap-2">
                            {showTimer ? (
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Timer className="w-4 h-4" />
                                    <span>Resend in {timer}s</span>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendLoading || showTimer}
                                    className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 flex items-center gap-2"
                                >
                                    {resendLoading ? (
                                        <div className="flex items-center gap-2">
                                            <LoadingSpinner size="sm"/>
                                            <span>Sending...</span>
                                        </div>
                                    ) : (
                                        "Resend OTP"
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUpVerifyOtpForm;
