import React, { useState } from 'react';
import { Calendar as Info, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';

const SessionCreationModal = ({ isOpen, onClose, tutorCredits, fetchTutorAvailability }) => {
  const [step, setStep] = useState(1);
  const [sessionType, setSessionType] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const userId = useSelector((state) => state.auth.userId);
  const axiosInstance = useAxios();

  if (!isOpen) return null;

  const generateTimeSlots = (duration) => {
    const slots = [];
    const start = 0;
    const end = 23;
    
    const currentTime = new Date();
    const minimumTime = new Date(
      currentTime.getTime() + (duration === 20 ? 30 : 60) * 60 * 1000
    );
  
    for (let hour = start; hour <= end; hour++) {
      ['00', '15', '30', '45'].forEach((minute) => {
        const checkTime = new Date(`${selectedDate}T${hour.toString().padStart(2, '0')}:${minute}`);
        
        if (checkTime >= minimumTime) {
          const formattedHour = hour % 12 || 12;
          const period = hour < 12 ? 'AM' : 'PM';
          const formattedTime = `${formattedHour}:${minute} ${period}`;
          
          slots.push({
            display: formattedTime,
            hour24: hour,
            minute
          });
        }
      });
    }
  
    return slots;
  };

  const convertTo24Hour = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };
  
  const handleSessionTypeSelect = (type) => {
    setSessionType(type);
    setStep(2);
  };

  const getTutorIdFromUserService = async (userId) => {
    try {
      // Make an API request to the User Service to get TutorDetails
      const response = await axiosInstance.get(`users/${userId}/tutor-details/`);
      console.log('responseeeeeeeee',response.data)
      return response.data.id;  // Assuming the tutor id is in the response data
    } catch (error) {
      console.error('Error fetching tutor details:', error);
      throw new Error('Unable to fetch tutor details');
    }
  };

  const handleSubmit = async () => {
    const time24 = convertTo24Hour(selectedTime);

    // Create the start datetime object by combining selected date and time
    const startDateTime = new Date(`${selectedDate}T${time24}:00`);
  
    // Calculate the end datetime based on session type (trial or full session)
    const endDateTime = new Date(startDateTime.getTime() + (sessionType === 'trial' ? 20 : 60) * 60 * 1000);
    
    const tutorId = await getTutorIdFromUserService(userId);
    console.log('Tutor ID:', tutorId);  // Ensure tutorId is being correctly retrieved
    const sessionData = {
      tutor_id: tutorId,
      session_type: sessionType,
      start_time: startDateTime.toISOString(), // Start time in ISO 8601 format
      end_time: endDateTime.toISOString(),  
      credits_required: sessionType === 'trial' ? Math.round(tutorCredits * 0.25) : tutorCredits,
      status: 'available',
    };
    console.log('sessiondata', sessionData);

    try {
      const response = await axiosInstance.post('tutor-availabilities/', sessionData);
      console.log('Session created:', response.data);
      fetchTutorAvailability(); // Trigger the fetch to refresh sessions
      onClose(); // Close the modal or form
    } catch (error) {
      console.log(error)
      // Check if it's a 409 conflict error and handle it gracefully
      if (error.response && error.response.status === 409) {
        toast.error("A slot with this time range already exists. Please choose a different time.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {step === 1 ? 'Select Session Type' : 'Choose Date & Time'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => handleSessionTypeSelect('trial')}
                className="border rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trial Session</h3>
                <p className="text-gray-600 mb-4">20 minutes introduction session</p>
                <div className="flex items-center gap-2 text-gray-600">
                  <Info className="w-4 h-4" />
                  <span>Students pay 25% ({Math.round(tutorCredits * 0.25)} credits)</span>
                </div>
              </div>

              <div 
                onClick={() => handleSessionTypeSelect('standard')}
                className="border rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard Session</h3>
                <p className="text-gray-600 mb-4">1 hour regular session</p>
                <div className="flex items-center gap-2 text-gray-600">
                  <Info className="w-4 h-4" />
                  <span>Full price ({tutorCredits} credits)</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time
                  </label>
                  <div className="h-64 overflow-y-auto border rounded-lg">
                    {generateTimeSlots(sessionType === 'trial' ? 20 : 60).map((slot) => (
                      <button
                        key={slot.display}
                        onClick={() => setSelectedTime(slot.display)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                          selectedTime === slot.display ? 'bg-blue-50 text-blue-700' : ''
                        }`}
                      >
                        {slot.display}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedDate || !selectedTime}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCreationModal;