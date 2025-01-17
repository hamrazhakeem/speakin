import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ChevronRight, Timer } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Navbar from '../../../components/user/common/Navbar';
import Footer from '../../../components/user/common/Footer';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const TutorVerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [cacheKey, setCacheKey] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          if (newTimer === 0) {
            setShowTimer(false);
          }
          return newTimer;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

// Add cleanup useEffect
useEffect(() => {
  return () => {
    localStorage.removeItem('prevPath');
  };
}, []);

// Update handleResendOtp
const handleResendOtp = async () => {
  setResendLoading(true);
  try {
    await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}resend-otp/`, 
      { email, cache_key: cacheKey }
     );
    setTimer(30); // Restart timer
    setShowTimer(true);
    setOtp(['', '', '', '', '', '']);
    toast.success('OTP resent successfully!');
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to resend OTP');
  } finally {
    setResendLoading(false);
  }
};

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}tutor/verify-email/`, {
        email
      });
      setCacheKey(response.data.cache_key);
      setShowOtpInput(true);
      setTimer(30); // Start timer
      setShowTimer(true);
      toast.success('OTP sent successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}tutor/verify-otp/`, {
        email,
        otp: otp.join(''),
        cache_key: cacheKey
      });
      navigate('/tutor/request', {state: { verifiedEmail: email }});
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 flex justify-center items-center p-4 mt-16 md:mt-24 mb-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-blue-50 rounded-full">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {showOtpInput ? 'Verify OTP' : 'Verify Your Email'}
              </h2>
              <p className="text-gray-600">
                {showOtpInput 
                  ? `Enter the 6-digit code sent to ${email}`
                  : 'First, lets verify your email address'}
              </p>
            </div>

            {showOtpInput ? (
              <div className="space-y-6">
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
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full h-12 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center group"
                >
                  {loading ? (
                    <LoadingSpinner size="sm"/>
                  ) : (
                    <>
                      Verify OTP
                      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
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
                        className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
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
            ) : (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors duration-200 outline-none border-gray-200 focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center group"
                >
                  {loading ? (
                    <LoadingSpinner size="sm"/>
                  ) : (
                    <>
                      Send OTP
                      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back to Sign In Link */}
            <div className="mt-6 text-center">
              <Link 
                to="/tutor/sign-in"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TutorVerifyEmail;