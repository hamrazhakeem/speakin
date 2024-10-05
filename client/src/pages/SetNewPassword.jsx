import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';

const SetNewPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email, cache_key } = location.state || {};
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit  = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}set_new_password/`, { email, newPassword: data.newPassword, cache_key });
            console.log('Password set successfully:', response.data);
            toast.success('Password updated successfully! You can now sign in.');
            navigate('/signin');
        } catch (error) {
            console.error(error.response?.data);
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
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Set New Password</h2>
                        <p className="text-gray-600 mb-6 text-sm md:text-base">Enter your new password below</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
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
                                validate: {
                                    noLeadingTrailingSpaces: value => value.trim() === value || 'Password must not start or end with spaces',
                                }
                            })}
                        />
                        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}

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
                                Set Password
                            </button>
                        )}
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SetNewPassword;