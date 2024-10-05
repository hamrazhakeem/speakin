import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ForgotPasswordOtpPage = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30); // Timer countdown (30 seconds)
    const [showTimer, setShowTimer] = useState(true); // Control display of timer
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!otp) {
            setError('Please enter the OTP.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}forgot_password_verify_otp/`, { email, otp, cache_key });
            console.log('OTP verified successfully:', response.data);
            toast.success('OTP verified successfully!');
            navigate('/set-new-password', { state: { email, cache_key } });
        } catch (error) {
            console.error(error.response?.data);
            setError(error.response?.data?.message || 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}resend_forgot_password_otp/`, { email, cache_key });
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
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Verify OTP</h2>
                    <p className="text-gray-600 mb-6 text-sm md:text-base">Enter the OTP sent to your email</p>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Enter your OTP"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
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

                    {showTimer ? (
                        <p className="text-gray-500 text-sm mt-4">Resend OTP in {timer} seconds</p>
                    ) : (
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

export default ForgotPasswordOtpPage;
