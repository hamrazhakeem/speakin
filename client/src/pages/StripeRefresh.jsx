import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSelector } from 'react-redux';

const StripeRefresh = () => {
  const navigate = useNavigate();
  const { isTutor } = useSelector(state => state.auth);

  const features = isTutor
    ? [
        {
          icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
          title: 'Secure Payments',
          description:
            'Your earnings are protected with industry-standard security measures, ensuring safe transactions every time.'
        },
        {
          icon: <CreditCard className="h-6 w-6 text-blue-600" />,
          title: 'Multiple Payment Options',
          description:
            'Choose from various payment methods to suit your preference and convenience.'
        },
        {
          icon: <Lock className="h-6 w-6 text-blue-600" />,
          title: 'Data Privacy',
          description:
            'We prioritize your privacy by safeguarding your financial information with advanced encryption.'
        }
      ]
    : [
        {
          icon: <Lock className="h-6 w-6 text-blue-600" />,
          title: 'Safe Transactions',
          description:
            'All payments are secured with bank-level encryption, ensuring your financial data remains private.'
        },
        {
          icon: <CreditCard className="h-6 w-6 text-blue-600" />,
          title: 'Flexible Payment Methods',
          description:
            'Select from various payment options, including credit cards, debit cards, and bank transfers.'
        },
        {
          icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
          title: 'Transaction Protection',
          description:
            'Your payments are protected by our guarantee policy, providing support for any transaction issues.'
        }
      ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Verify Your Account for Withdrawals
          </h1>
          <p className="mt-4 text-gray-600">
            Please complete your Stripe setup to enable seamless withdrawals.
          </p>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg shadow-md">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Why Verify with Stripe?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/withdraw')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
            >
              Retry Stripe Setup
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need assistance?{' '}
            <a
              href="mailto:support@speakin.com"
              className="text-blue-600 hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StripeRefresh;