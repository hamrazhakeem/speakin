import React from 'react';
import { useNavigate } from 'react-router-dom';
import TutorNavbar from '../components/TutorNavbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const ApplicationConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <TutorNavbar />
      <main className="flex-1 flex justify-center items-center p-4 mt-16 md:mt-24 mb-10">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Application Submitted</h1>
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            Thank you for applying to be a tutor with SpeakIn!
          </p>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <p className="text-gray-700 mb-4">
              Your application is currently under review. You will receive an notification to the provided email regarding the status of your application within three business days.
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Application Status: Under Review</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/become-a-tutor')}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Return to Home
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Need help? <Link to={'/contact'} className="text-blue-500 hover:underline">Contact Support</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ApplicationConfirmation;