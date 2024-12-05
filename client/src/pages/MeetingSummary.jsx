import React, { useState, useEffect } from 'react';
import useAxios from '../hooks/useAxios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MeetingSummary = () => {
  const location = useLocation();
  const { bookingId } = location.state || {};
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.auth);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    console.log('booking_iddddd', bookingId)
    if (!bookingId) {
      console.error("Missing bookingId in location.state");
      navigate("/"); // Redirect to a fallback page
      return;
    }

    const updateBookingStatus = async () => {
      try {
        const response = await axiosInstance.get(`users/${userId}/`)
        const user = response.data;
        setUserType(user.user_type); 
        await axiosInstance.patch(`bookings/${bookingId}/`, {
          booking_status: "completed",
        });
        console.log("Booking status updated to completed.");
      } catch (error) {
        console.error("Error updating booking status:", error);
      }
    };

    updateBookingStatus();
  }, []);

  const handleReturn = () => {
    // Navigate based on user type
    if (userType === 'student') {
      navigate('/bookings');
    } else {
      navigate('/tutor-sessions');
    } 
  };

  // If user data is not yet loaded, show a loading state
  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white shadow-2xl rounded-2xl p-8 text-center">
        <div className="space-y-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-20 w-20 mx-auto text-green-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h2 className="text-3xl font-bold text-gray-800">
            Meeting Ended
          </h2>
          <p className="text-gray-600 text-lg">
            Your session has been successfully completed.
          </p>
        </div>
        
        <div className="pt-6">
          <button 
            onClick={handleReturn}
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Return to {userType === 'student' ? 'Bookings' : 'Sessions'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingSummary;