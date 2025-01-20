import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';

const StripeRefreshContent = () => {
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
    <div className="min-h-screen bg-gray-50">
    <div className="bg-white">
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-relaxed">
          Complete Your Payment Setup
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          To start receiving payments, you'll need to complete your Stripe Connect account setup
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
              <div className="bg-blue-50 rounded-lg p-3 inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() => navigate('/withdraw')}
          className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          Setup Payment Method
          <ChevronRight className="ml-2 h-5 w-5" />
        </button>
        <p className="mt-4 text-sm text-gray-500">
          You'll be redirected to payments to start over to complete your account setup
        </p>
      </div>
    </div>
  </div>  
  </div>
  )
}

export default StripeRefreshContent