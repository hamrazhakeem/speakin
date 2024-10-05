import React, { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [backendErrors, setBackendErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {                              
      const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}sign_up/`, {
        name: data.name,
        email: data.email,
        password: data.password,
        user_type: 'student',
      });
      console.log('Sign up successful', response.data);
      reset();
      setBackendErrors({});

      const { cache_key } = response.data;

      navigate('/verify-otp', { state: { email: data.email, cache_key } });
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setBackendErrors(error.response.data.errors);
      } else {
        setBackendErrors({ general: 'Something went wrong. Please try again.' });
      }
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
            <h2 className="text-2xl md:text-3xl font-bold mb-2">SpeakIn ID</h2>
            <p className="text-gray-600 mb-6 text-sm md:text-base">Create your SpeakIn Account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
              type="text"
              placeholder="Name"
              required
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none ${errors.name || backendErrors.name ? 'border-red-500' : 'border-gray-300'}`}
              {...register('name', {
                required: 'Name is required',
                pattern: {
                  value: /^(?!.*\s{2,})[a-zA-ZÀ-ž]+(([' -][a-zA-ZÀ-ž])?[a-zA-ZÀ-ž]*)*$/,
                  message: 'Name must only contain letters, spaces, hyphens, or apostrophes, and must not start or end with spaces or contain consecutive spaces.',
                },
              })}
            />

            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            {backendErrors.name && <p className="text-red-500 text-sm">{backendErrors.name}</p>}

            <input
              type="email"
              placeholder="Email"
              required
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none ${errors.email || backendErrors.email ? 'border-red-500' : 'border-gray-300'}`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email format',
                },
                validate: {
                  noLeadingTrailingSpaces: (value) =>
                    value.trim() === value || 'Email must not start or end with spaces',
                },
              })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            {backendErrors.email && <p className="text-red-500 text-sm">{backendErrors.email}</p>}

              <input
                type="password"
                placeholder="Password"
                required
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none ${errors.password || backendErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                {...register('password', {
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
                    noLeadingTrailingSpaces: (value) =>
                      value.trim() === value || 'Password must not start or end with spaces',
                  },
                })}
              />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            {backendErrors.password && <p className="text-red-500 text-sm">{backendErrors.password}</p>}

            <p className="text-sm md:text-base text-gray-600">Have a code for free trial? Enter below</p>
            <input
              type="text"
              placeholder="Code"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            {backendErrors.general && <p className="text-red-500 text-sm">{backendErrors.general}</p>}

            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage;
