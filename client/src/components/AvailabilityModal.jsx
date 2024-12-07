import React, { useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import { format, toDate } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateCredits } from '../redux/authSlice';

const AvailabilityModal = ({ tutorId, onClose }) => {
  const axiosInstance = useAxios();
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId, credits } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [availabilityResponse, bookingsResponse] = await Promise.all([
          axiosInstance.get('tutor-availabilities/'),
          axiosInstance.get('bookings/')
        ]);

        // Current time for comparison
        const now = new Date();

        console.log(availabilityResponse.data)
        // Filter availabilities for the specific tutor and apply lead time
        const tutorAvailabilities = availabilityResponse.data
        .filter(slot => slot.tutor_id === tutorId)
        .filter(slot => {
          const startTime = toDate(slot.start_time);
          const leadTimeRequired = 3 * 60 * 60 * 1000; // Example: 3 hours in milliseconds
          return startTime.getTime() - now.getTime() > leadTimeRequired;
        })
        .filter(slot => {
          // Only display slots that are not booked (`is_booked` is false) or have `booking_status` as 'confirmed'
          const hasBooking = slot.bookings && slot.bookings.length > 0;
          
          if (!hasBooking) {
            return !slot.is_booked; // Display if `is_booked` is false and no bookings exist
          } else {
            return slot.bookings.some(
              booking => booking.booking_status === 'confirmed' || 
                         (booking.booking_status === 'canceled_by_student' && !slot.is_booked)
            );          }
        });
      
      

        const bookingsMap = bookingsResponse.data.reduce((acc, booking) => {
          // Check if the booking belongs to the current user and is confirmed
          if (booking.student_id === userId && booking.booking_status === 'confirmed') {
            acc[booking.availability] = booking.booking_status;
          }
          return acc;
        }, {});
        

        const enhancedAvailabilities = tutorAvailabilities.map(slot => ({
          ...slot,
          bookedByYou: bookingsMap[slot.id] || null
        }));
        console.log(enhancedAvailabilities)
        console.log(bookingsResponse.data)
        setAvailability(enhancedAvailabilities);
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load availability. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tutorId, userId]);

  const handleBooking = async (slotId, creditsRequired) => {
    try {
      const response = await axiosInstance.post('bookings/', {
        availability: slotId,
        student_id: userId,
        booking_status: 'confirmed',
      });
      
      if (response.status === 201) {
        dispatch(updateCredits(credits - creditsRequired));
        toast.success('Booking confirmed successfully');
        onClose();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.non_field_errors?.[0] ||
                           err.response?.data?.detail ||
                           (err.response?.data?.error === 'Failed to connect to session_service' 
                             ? "Internal Server Error" 
                             : err.response?.data?.error) ||
                           err.response?.data?.message ||
                           "An error occurred";
        toast.error(errorMessage);
        onClose();
    }
  };

  const getStatusDisplay = (slot) => {
    if (slot.bookedByYou) {
      return {
        text: 'Booked by you',
        color: 'text-blue-500'
      };
    }
    return {
      text: slot.is_booked === false ? 'Available' : 'Booked',
      color: slot.is_booked === false ? 'text-green-500' : 'text-red-500'
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4 sm:px-0">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-6 max-h-[80vh]">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4">Tutor Availability</h2>
  
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : availability.length === 0 ? (
          <p className="text-gray-500">No available slots.</p>
        ) : (
          <ul className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
            {availability.map((slot) => {
              const statusDisplay = getStatusDisplay(slot);
              return (
                <li
                  key={slot.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-700 font-medium">
                      Type: {slot.session_type.charAt(0).toUpperCase() + slot.session_type.slice(1)}
                    </p>
                    <p className={`font-medium ${statusDisplay.color}`}>
                      Status: {statusDisplay.text}
                    </p>
                  </div>
                  <p className="text-gray-600">
                    Start: {format(toDate(slot.start_time), 'h:mm a - MMM d, yyyy')}
                  </p>
                  <p className="text-gray-600">
                    End: {format(toDate(slot.end_time), 'h:mm a - MMM d, yyyy')}
                  </p>
                  <p className="text-gray-600">
                    Duration: {slot.session_type === 'trial' ? '20 minutes' : '60 minutes'}
                  </p>
                  {slot.is_booked === false && !slot.bookedByYou && (
                    <button
                      className="mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
                      onClick={() => handleBooking(slot.id, slot.credits_required)}
                    >
                      Book for {slot.credits_required} credits
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AvailabilityModal;
