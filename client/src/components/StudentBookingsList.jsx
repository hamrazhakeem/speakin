import React, { useState } from 'react';
import { Clock, CreditCard, RotateCw, User, VideoIcon } from 'lucide-react';
import EmptyState from './EmptyState';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';
import Avatar from './Avatar';
import { useNavigate } from 'react-router-dom';

const StudentBookingsList = ({ sessions, fetchStudentSessions }) => {
  const axiosInstance = useAxios();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchStudentSessions();
    setTimeout(() => setIsRefreshing(false), 1000); // Ensure animation plays for at least 1 second
  };

  const formatLocalTime = (utcTime) => {
    const date = new Date(utcTime);
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const isSessionMissed = (session) => {
    const sessionStartTime = new Date(session.availabilityDetails.start_time);
    const currentTime = new Date();
  
    // Add 5 minutes to the session start time
    const fiveMinutesAfterStartTime = new Date(sessionStartTime.getTime() + 5 * 60000);
  
    // Check if current time is greater than 5 minutes after start time
    const isPastFiveMinutes = currentTime > fiveMinutesAfterStartTime;
  
    // Check if both student and tutor did not join within 5 minutes
    const isStudentMissed = !session.student_joined_within_5_min;
    const isTutorMissed = !session.tutor_joined_within_5_min;
  
    return isPastFiveMinutes && isStudentMissed && isTutorMissed;
  };
  

  const getSessionDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / (1000 * 60));
    return `${minutes} minutes`;
  };

  const getStatusDisplay = (session) => {
    const bookingStatus = session.booking_status;

    // Check for missed session condition
    if (isSessionMissed(session)) {
      return 'Session Missed: Both Tutor and Student Did Not Join';
    }

    if (bookingStatus === 'canceled_by_student') {
      return 'You have canceled this session';
    }
    if (bookingStatus === 'no_show_by_student') {
      return 'Session Missed: Unable to Attend';
    }
    return bookingStatus.replace(/_/g, ' ');
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
        return 'bg-cyan-50 text-cyan-700 border border-cyan-200';
      case 'ongoing':
        return 'bg-violet-50 text-violet-700 border border-violet-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'canceled_by_tutor':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'canceled_by_student':
        return 'bg-pink-50 text-pink-700 border border-pink-200';
      case 'no_show_by_tutor':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'no_show_by_student':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
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
          session.availabilityDetails.session_type === 'trial' ? '1 hour' : '2 hours'
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
      console.log(error)
      // Extract backend message and display it
      const backendMessage = error.response?.data?.message || error.response?.data?.error || 'Error cancelling session';
      toast.error(backendMessage);
      console.error('Error cancelling session:', error);
    }
    fetchStudentSessions();
  };

  const handleJoinSession = (bookingId) => {
    navigate('/video-call-setup', { state: { bookingId } });
  };
  
  const renderCreditInfo = (session) => {
    const isCanceled =
      session.booking_status === 'canceled_by_tutor' ||
      session.booking_status === 'canceled_by_student' ||
      session.booking_status === 'no_show_by_tutor';
  
    const creditsRequired = session.availabilityDetails.credits_required;

    if (isSessionMissed(session)) {
      return (
        <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
          <CreditCard className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-900">
            Credits have been retained by the platform as per no-show policy
          </span>
        </div>
      );
    }

    const bonusCredits = Math.floor(creditsRequired * 0.1);
    const totalRefund = creditsRequired + bonusCredits;
  
    if (isCanceled) {
      return (
        <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
          <CreditCard className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-900">
            {session.booking_status === 'no_show_by_tutor'
              ? `${totalRefund} Credits refunded to your account (${creditsRequired} Credits + 10% bonus of ${bonusCredits} Credits for inconvenience)`
              : `${creditsRequired} Credits were refunded to your account`}
          </span>
        </div>
      );
    }
  
    return (
      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
        <CreditCard className="w-5 h-5 text-gray-500" />
        <span className="font-medium text-gray-900">
          {creditsRequired} Credits Paid
        </span>
      </div>
    );
  };
  

  if (!sessions || sessions.length === 0) {
    return (
      <EmptyState
        handleRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        title="No Bookings Found"
        description="You haven't booked any slots yet. Browse our tutors to find the perfect match for your learning needs."
        showButton={false} 
        bgColor="bg-green-50"
        iconColor="text-green-600"
      />
    );
  }

  const getRoomNameStatus = (session) => {
    const sessionStartTime = new Date(session.availabilityDetails.start_time);
    const sessionEndTime = new Date(session.availabilityDetails.end_time);
    const currentTime = new Date();
    const fiveMinutesBefore = new Date(sessionStartTime.getTime() - 5 * 60000);
    
    const isConfirmedStatus = session.booking_status === 'confirmed' || 
                               session.booking_status === 'ongoing';
    
    // New condition to check if session is past or in progress
    if (isConfirmedStatus) {
      // Session is currently happening
      if (currentTime >= sessionStartTime && currentTime <= sessionEndTime) {
        return {
          type: 'showRoomName',
          roomName: session.video_call_link
        };
      }
      
      // Within 5 minutes before session start
      if (currentTime >= fiveMinutesBefore && currentTime < sessionStartTime) {
        return {
          type: 'showRoomName',
          roomName: session.video_call_link
        };
      }
      
      // Before 5 minutes of session start
      if (currentTime < fiveMinutesBefore) {
        const timeDiff = fiveMinutesBefore - currentTime;
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.ceil((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        let timeMessage = 'Room name will be available 5 min before session';
        if (hours > 0) {
          timeMessage = `Room name will be available in ${hours}h ${minutes}m`;
        } else if (minutes > 0) {
          timeMessage = `Room name will be available in ${minutes} min`;
        }
  
        return {
          type: 'waitingMessage',
          timeMessage
        };
      }
    }
  
    return null;
  };

  const cleanRoomName = (roomLink) => {
    const prefix = "https://speakin.daily.co/";
    if (roomLink && roomLink.startsWith(prefix)) {
      return roomLink.slice(prefix.length);
    }
    return roomLink;
  };

  const renderActionButtons = (session) => {
    // Hide buttons if session is missed
    if (isSessionMissed(session)) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-3">
        {(session.booking_status === 'confirmed' || session.booking_status === 'ongoing') && (
          <button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center font-medium transition-colors duration-200"
            onClick={() => handleJoinSession(session.id)}
          >
            <VideoIcon className="w-4 h-4 mr-2" />
            Join Session
          </button>
        )}
        {session.booking_status === 'confirmed' && (
          <button
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200"
            onClick={() => handleCancelSession(session)}
          >
            Cancel Session
          </button>
        )}
        {session.booking_status === 'completed' && (
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200">
            Leave Review
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isRefreshing}
        >
          <RotateCw
            className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`}
          />
        </button>
      </div>
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
                {getStatusDisplay(session)}
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
              {renderActionButtons(session)}

            </div>
          </div>
          {/* Room Name Notification */}
          {(() => {
          const roomNameStatus = getRoomNameStatus(session);
          
          if (roomNameStatus) {
            if (roomNameStatus.type === 'showRoomName' && !isSessionMissed(session)) {
              const cleanedRoomName = cleanRoomName(roomNameStatus.roomName);
              return (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-green-800 mb-2">
                      🔐 Secure Room Name Available
                    </p>
                    <div className="flex items-center space-x-2">
                      <code className="bg-green-100 px-3 py-1 rounded text-green-900 select-all">
                        {cleanedRoomName}
                      </code>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(cleanedRoomName);
                          toast.success('Room name copied to clipboard!');
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              );
            } else if (roomNameStatus.type === 'waitingMessage') {
              return (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-blue-800 font-medium">
                    🕒 {roomNameStatus.timeMessage}
                  </p>
                </div>
              );
            }
          }
          
          return null;
        })()}
        </div>
      ))}
    </div>
  );
};

export default StudentBookingsList;