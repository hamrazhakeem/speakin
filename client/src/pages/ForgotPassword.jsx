import React, { useState } from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState(''); 
    const [error, setError] = useState(''); 
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email) {
            setError('Please enter your email.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}forgot_password/`, { email });
            console.log('OTP sent successfully:', response.data);
            toast.success('OTP sent successfully! Please check your email.');
            navigate('/forgot-password-verify-otp', { state: { email, cache_key: response.data.cache_key } });
        } catch (error) {
            console.error(error.response?.data);
            setError(error.response?.data?.error || 'An unknown error occurred.');
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
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Forgot Password</h2>
                        <p className="text-gray-600 mb-6 text-sm md:text-base">Enter your email to receive an OTP</p>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button 
                            type="submit"
                            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Send OTP
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ForgotPassword;