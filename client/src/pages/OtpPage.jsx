import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { setTokens } from '../redux/authSlice';

const OtpPage = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [cacheKey, setCacheKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30); 
    const [showTimer, setShowTimer] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const { email: emailFromSignUp, cache_key } = location.state || {};
        if (emailFromSignUp) {
            setEmail(emailFromSignUp);
        } else {
            setError('Email not found. Please try signing up again.');
        }
        if (cache_key) {
            setCacheKey(cache_key);  
        } else {
            setError('Cache key not found. Please try signing up again.');  
        }
    }, [location.state]);

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

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !cacheKey) {
            setError('Email or cache key not found. Please try signing up again.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}verify_otp/`, { email, otp, cache_key: cacheKey });
            const { access, refresh, name, id, credits } = response.data;

            dispatch(setTokens({ accessToken: access, refreshToken: refresh, userName: name, isAdmin: false, userId: id, isStudent: true, credits: credits }));
      
            toast.success(`Welcome, ${name}!`);

            setTimeout(() => {
                navigate('/home');
            }, 1500);
        } catch (error) {
            console.error(error.response?.data);
            setLoading(false); 
            setTimeout(() => {
                setError(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
            }, 500);
        } finally {
            if (error) {
                setLoading(false);
            } else {
                setTimeout(() => {
                    setLoading(false);
                }, 1000); 
            }
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}resend_otp/`, { email, cache_key: cacheKey });
            console.log('OTP resent successfully:', response.data);
            toast.success('New OTP sent to your email!');
            setTimer(30); 
            setShowTimer(true); 
        } catch (error) {
            console.error(error.response?.data);
            setError(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex justify-center items-center p-4 mt-16 md:mt-24 mb-10">
                <div className="w-full max-w-md text-center">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">OTP Verification</h2>
                        <p className="text-gray-600 mb-6 text-sm md:text-base">Enter the OTP sent to your email</p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            required
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        {loading ? (
                            <div className="flex justify-center items-center mt-4">
                                <svg
                                    className="animate-spin h-10 w-10 text-blue-500 mx-auto"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    ></path>
                                </svg>
                            </div>
                        ) : (
                            <button
                                type="submit"
                                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Verify OTP
                            </button>
                        )}
                    </form>
                    {showTimer && (
                        <p className="text-gray-500 text-sm mt-4">Resend OTP in {timer} seconds</p>
                    )}

                    {!showTimer && (
                        <button
                        onClick={handleResendOtp}
                        className="w-full mt-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                    >
                        Resend OTP
                    </button>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OtpPage;
