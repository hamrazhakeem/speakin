import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ChevronRight, KeyRound, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useEffect } from 'react';

const SetNewPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email, cache_key } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        if (!cache_key || !email) {
            navigate('/sign-in');
        }
    }, [navigate, cache_key, email]);

    if (!cache_key || !email) return null;

    const onSubmit = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_GATEWAY_URL}set-new-password/`, 
                { 
                    email, 
                    newPassword: data.newPassword, 
                    cache_key 
                }
            );
            console.log('Password set successfully:', response.data);
            toast.success('Password updated successfully! You can now sign in.');
            navigate('/sign-in');
        } catch (error) {
            console.error(error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to update password');
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
                        to="/sign-in" 
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Sign In
                    </Link>

                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {/* Icon Header */}
                        <div className="flex justify-center mb-6">
                            <div className="p-3 bg-blue-50 rounded-full">
                                <KeyRound className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>

                        {/* Header Text */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Set New Password</h2>
                            <p className="text-gray-600">
                                Create a strong password for your account<br />
                                <span className="font-medium text-gray-900">{email}</span>
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* New Password Input */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors duration-200 outline-none pr-12 ${
                                        errors.newPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                    }`}
                                    {...register('newPassword', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters long',
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/,
                                            message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
                                        },
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                            )}

                            {/* Confirm Password Input */}
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors duration-200 outline-none pr-12 ${
                                        errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                    }`}
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: value => value === watch('newPassword') || 'Passwords do not match'
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center group"
                            >
                                {loading ? (
                                    <div className="h-5 flex items-center">
                                        <LoadingSpinner size="sm"/>
                                    </div>
                                ) : (
                                    <>
                                        Set New Password
                                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Password Requirements */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Password must contain:</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• At least 8 characters</li>
                                <li>• One uppercase letter</li>
                                <li>• One lowercase letter</li>
                                <li>• One number</li>
                                <li>• One special character</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SetNewPassword;