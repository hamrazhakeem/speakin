import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, ShieldQuestion } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { commonApi } from '../../../../api/commonApi';
import LoadingSpinner from '../../../common/ui/LoadingSpinner';
import PrimaryButton from '../../common/ui/buttons/PrimaryButton';
import FormInput from '../../common/ui/input/FormInput';

const ForgotPasswordForm = () => {
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
            const response = await commonApi.forgotPassword(axios, email);
            toast.success('OTP sent successfully! Please check your email.');
            navigate('/forgot-password/verify-otp', { 
                state: { 
                    email, 
                    cache_key: response.cache_key 
                } 
            });
        } catch (error) {
            toast.error(error.response?.data?.error || 'An unknown error occurred.');
            console.error(error.response?.data);
            setError(error.response?.data?.error || 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 bg-gray-50">
            <main className="flex justify-center items-center p-4">
                <div className="w-full max-w-md mt-10 mb-16">
                    <Link 
                        to="/sign-in" 
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Sign In
                    </Link>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <div className="flex justify-center mb-6">
                            <div className="p-3 bg-blue-50 rounded-full">
                                <ShieldQuestion className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Forgot Password?
                            </h2>
                            <p className="text-gray-600">
                                No worries! Enter your email and we'll send you an OTP to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <FormInput
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={Mail}
                                required
                            />

                            <PrimaryButton
                                type="submit"
                                loading={loading}
                            >
                                Send OTP
                            </PrimaryButton>

                            <p className="mt-6 text-center text-sm text-gray-600">
                                Remember your password?{' '}
                                <Link to="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForgotPasswordForm;