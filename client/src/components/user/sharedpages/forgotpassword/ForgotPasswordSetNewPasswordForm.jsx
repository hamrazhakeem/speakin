import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { commonApi } from '../../../../api/commonApi';
import PasswordRequirements from '../../common/ui/input/PasswordRequirements';
import PrimaryButton from '../../common/ui/buttons/PrimaryButton';
import PasswordInput from '../../common/ui/input/PasswordInput';
import axios from 'axios';

const ForgotPasswordSetNewPasswordForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email, cache_key } = location.state || {};
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

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
            await commonApi.setNewPassword(axios, {
                email,
                newPassword: data.newPassword,
                cache_key
            });
            
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
        <div className="flex-1 bg-gray-50">
            <main className="flex justify-center items-center p-4">
                <div className="w-full max-w-md mt-10 mb-10">
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
                            <div>
                                <PasswordInput
                                    placeholder="Enter new password"
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
                                    error={errors.newPassword}
                                />
                            </div>

                            <div>
                                <PasswordInput
                                    placeholder="Confirm new password"
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: value => value === watch('newPassword') || 'Passwords do not match'
                                    })}
                                    error={errors.confirmPassword}
                                />
                            </div>

                            <PrimaryButton
                                type="submit"
                                loading={loading}
                                disabled={loading}
                            >
                                Set New Password
                            </PrimaryButton>
                        </form>

                        <div className="mt-6">
                            <PasswordRequirements />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForgotPasswordSetNewPasswordForm;