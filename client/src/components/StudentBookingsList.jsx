import React from 'react';
import { Clock, CreditCard, User, VideoIcon } from 'lucide-react';
import EmptyState from './EmptyState';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';

const StudentBookingsList = ({ sessions, fetchStudentSessions }) => {
  const axiosInstance = useAxios();

  const formatLocalTime = (utcTime) => {
    const date = new Date(utcTime);
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getSessionDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / (1000 * 60));
    return `${minutes} minutes`;
  };

  const getSessionTypeStyles = (type) => {
    switch (type) {
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      case 'standard':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleCancelSession = async (sessionId) => {
    try {
      const response = await axiosInstance.post(`cancel-booking/${sessionId}/`);
      if (response.status === 200) {
        toast.success('Session cancelled successfully');
        fetchStudentSessions();
      }
    } catch (error) {
      toast.error('Error cancelling session');
      console.error('Error cancelling session:', error);
    }
  };

  const handleJoinSession = (meetingLink) => {
    window.open(meetingLink, '_blank');
  };

  if (!sessions || sessions.length === 0) {
    return (
      <EmptyState
        title="No Sessions Found"
        description="You haven't booked any sessions yet. Browse our tutors to find the perfect match for your learning needs."
        showButton={false} 
        bgColor="bg-green-50"
        iconColor="text-green-600"
      />
    );
  }

  return (
    <div className="space-y-4">
    {sessions.map((session) => (
      <div
        key={session.id}
        className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getSessionTypeStyles(
                session.availabilityDetails.session_type
              )}`}
            >
                {session.availabilityDetails.session_type} {/* Session Type */}
                </span>
            <span className={`font-medium ${getStatusStyles(session.booking_status)}`}>
              {session.booking_status}
            </span>
          </div>
        </div>

    <div className="space-y-4">
      {/* Display tutor details */}
      <div className="flex items-center text-gray-700">
  <User className="w-5 h-5 mr-2 text-gray-400" />
  <div>
    <p className="font-medium">Tutor: {session.tutorDetails?.speakin_name}</p>
    <p className="text-sm text-gray-500">{session.tutorDetails?.about}</p>
  </div>
</div>


      {/* Rest of session details */}
      <div className="flex items-center text-gray-700">
        <Clock className="w-5 h-5 mr-2 text-gray-400" />
        <div>
        <p className="font-medium">{formatLocalTime(session.availabilityDetails.start_time)}</p> {/* Start Time */}
        <p className="text-sm text-gray-500">
              Duration: {getSessionDuration(session.availabilityDetails.start_time, session.availabilityDetails.end_time)} {/* Session Duration */}
            </p>
        </div>
      </div>

      <div className="flex items-center text-gray-700">
        <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
        <span className="font-medium">{session.availabilityDetails.credits_required} Credits Used</span> {/* Credits used */}
        </div>

      <div className="flex flex-wrap gap-3 mt-4">
        {session.booking_status === 'confirmed' && ( 
          <>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
              onClick={() => handleJoinSession(session.video_call_link)}
            >
              <VideoIcon className="w-4 h-4 mr-2" />
              Join Session
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              onClick={() => handleCancelSession(session.id)}
            >
              Cancel Session
            </button>
          </>
        )}

        {session.booking_status === 'completed' && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            Leave Review
          </button>
        )}
      </div>
    </div>
  </div>
))}

    </div>
  );
};

export default StudentBookingsList;