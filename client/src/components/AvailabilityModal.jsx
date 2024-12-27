import React, { useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import { format, toDate } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { updateCredits } from '../redux/authSlice';
import { X, Clock, Calendar, CreditCard } from 'lucide-react'; // Import icons
import LoadingSpinner from './ui/LoadingSpinner';

const AvailabilityModal = ({ tutorId, onClose }) => {
  const axiosInstance = useAxios();
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false); // New state for booking action
  const [loadingSlotId, setLoadingSlotId] = useState(null); // Track which slot is being booked
  const { userId, credits } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
    setBookingLoading(true);
    setLoadingSlotId(slotId);
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
        console.log(err)
    } finally {
      setBookingLoading(false);
      setLoadingSlotId(null);
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center px-4 sm:px-0">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-6 max-h-[90vh] relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Sessions</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
            <LoadingSpinner size="lg" className="text-blue-600" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 rounded-xl text-red-600">
            <p>{error}</p>
          </div>
        ) : availability.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-3">
              <Calendar className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-600 font-medium">No available slots at the moment.</p>
            <p className="text-gray-500 text-sm mt-1">Please check back later.</p>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {availability.map((slot) => {
              const statusDisplay = getStatusDisplay(slot);
              const isBooking = bookingLoading && loadingSlotId === slot.id;
              
              return (
                <div
                  key={slot.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all duration-200"
                >
                  {/* Session Type Badge */}
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${slot.session_type === 'trial' ? 
                        'bg-purple-50 text-purple-700' : 
                        'bg-blue-50 text-blue-700'}`}
                    >
                      {slot.session_type.charAt(0).toUpperCase() + slot.session_type.slice(1)} Session
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${statusDisplay.color === 'text-green-500' ? 'bg-green-50 text-green-700' :
                        statusDisplay.color === 'text-blue-500' ? 'bg-blue-50 text-blue-700' :
                        'bg-red-50 text-red-700'}`}
                    >
                      {statusDisplay.text}
                    </span>
                  </div>

                  {/* Time Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{format(toDate(slot.start_time), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {format(toDate(slot.start_time), 'h:mm a')} - {format(toDate(slot.end_time), 'h:mm a')}
                      </span>
                    </div>
                  </div>

                  {/* Book Button */}
                  {slot.is_booked === false && !slot.bookedByYou && (
                    <button
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-blue-400"
                      onClick={() => handleBooking(slot.id, slot.credits_required)}
                      disabled={isBooking}
                    >
                      {isBooking ? (
                        <div className="h-5 flex items-center">
                          <LoadingSpinner size="sm"/>
                        </div>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4" />
                          Book for {slot.credits_required} credits
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityModal;
