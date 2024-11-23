import React from 'react';
import { Clock, CreditCard, User, VideoIcon } from 'lucide-react';
import EmptyState from './EmptyState';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';
import Avatar from './Avatar';

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

  const getStatusDisplay = (status) => {
    if (status === 'canceled_by_student') {
      return 'You have canceled this session';
    }
    return status.replace(/_/g, ' ');
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
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'ongoing':
        return 'bg-purple-50 text-purple-600 border border-purple-200';
      case 'completed':
        return 'bg-green-50 text-green-600 border border-green-200';
      case 'canceled_by_tutor':
      case 'canceled_by_student':
        return 'bg-red-50 text-red-600 border border-red-200';
      case 'no_show_by_tutor':
      case 'no_show_by_student':
        return 'bg-orange-50 text-orange-600 border border-orange-200';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  const handleCancelSession = async (session) => {
    const sessionStartTime = new Date(session.availabilityDetails.start_time);
    const currentTime = new Date();
  
    const allowedTimeBeforeSessionStart = session.availabilityDetails.session_type === 'trial' ? 60 : 120;
    const timeDifferenceInMinutes = (sessionStartTime - currentTime) / (1000 * 60);
  
    // Prevent cancellation close to session start time
    if (timeDifferenceInMinutes < allowedTimeBeforeSessionStart) {
      toast.error(
        `Cannot cancel ${session.availabilityDetails.session_type} session within ${
          session.session_type === 'trial' ? '1 hour' : '2 hours'
        } of start time.`
      );
      return;
    }
  
    try {
      const response = await axiosInstance.patch(`tutor-availabilities/${session.availability}/`, {
        booking_status: 'canceled_by_student',
      });
  
      if (response.status === 204) {
        toast.success('Session cancelled successfully');
      }
      fetchStudentSessions();
    } catch (error) {
      // Extract backend message and display it
      const backendMessage = error.response?.data?.message || error.response?.data?.error || 'Error cancelling session';
      toast.error(backendMessage);
      console.error('Error cancelling session:', error);
    }
    fetchStudentSessions();

  };
  
  

  const handleJoinSession = (meetingLink) => {
    window.open(meetingLink, '_blank');
  };

  const renderCreditInfo = (session) => {
    const isCanceled = session.booking_status === 'canceled_by_tutor' || session.booking_status === 'canceled_by_student';
    
    if (isCanceled) {
      return (
        <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
          <CreditCard className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-900">
            {session.availabilityDetails.credits_required} Credits was refunded to your account
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
        <CreditCard className="w-5 h-5 text-gray-500" />
        <span className="font-medium text-gray-900">
          {session.availabilityDetails.credits_required} Credits Paid
        </span>
      </div>
    );
  };

  if (!sessions || sessions.length === 0) {
    return (
      <EmptyState
        title="No Bookings Found"
        description="You haven't booked any slots yet. Browse our tutors to find the perfect match for your learning needs."
        showButton={false} 
        bgColor="bg-green-50"
        iconColor="text-green-600"
      />
    );
  }

  return (
    <div className="space-y-6">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
        >
          {/* Header Section */}
          <div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b">
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${getSessionTypeStyles(
                  session.availabilityDetails.session_type
                )}`}
              >
                {session.availabilityDetails.session_type}
              </span>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${getStatusStyles(session.booking_status)}`}>
                {getStatusDisplay(session.booking_status)}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="w-5 h-5 mr-2 text-gray-400" />
              <div>
                <p className="font-medium">{formatLocalTime(session.availabilityDetails.start_time)}</p>
                <p className="text-sm text-gray-500">
                  Duration: {getSessionDuration(session.availabilityDetails.start_time, session.availabilityDetails.end_time)}
                </p>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Tutor Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Avatar
                    src={session.tutorUserResponse.profile_image}
                    name={session.tutorDetails?.speakin_name || ''}
                    size={48}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Tutor: {session.tutorDetails?.speakin_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {session.tutorUserResponse.country || 'Country not specified'}
                    </p>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Languages spoken:</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {session.tutorDetails?.language_spoken.map((lang, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-gray-200 text-gray-700"
                          >
                            {lang.language} - {lang.proficiency}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Credits Info */}
              {renderCreditInfo(session)}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Session Language */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-xl">🌐</span>
                  <div>
                    <p className="font-medium text-gray-900">Session Language</p>
                    <p className="mt-1 text-gray-700">
                      {session.availabilityDetails.language_to_teach || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {session.booking_status === 'confirmed' && (
                  <>
                    <button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center font-medium transition-colors duration-200"
                      onClick={() => handleJoinSession(session.video_call_link)}
                    >
                      <VideoIcon className="w-4 h-4 mr-2" />
                      Join Session
                    </button>
                    <button
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200"
                      onClick={() => handleCancelSession(session)}
                    >
                      Cancel Session
                    </button>
                  </>
                )}
                {session.booking_status === 'completed' && (
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200">
                    Leave Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentBookingsList;