import React, { useState, useEffect } from 'react';
import { Clock, CreditCard, RotateCw, VideoIcon } from 'lucide-react';
import EmptyState from './EmptyState';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';
import Avatar from './Avatar';
import { useNavigate } from 'react-router-dom';

const SessionsList = ({ sessions, onAddSession, fetchTutorAvailability }) => {
  const axiosInstance = useAxios();
  const [sessionsWithStudentInfo, setSessionsWithStudentInfo] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTutorAvailability();
    setTimeout(() => setIsRefreshing(false), 1000); // Ensure animation plays for at least 1 second
  };

  useEffect(() => {
    if (!sessions || sessions.length === 0) {
      setSessionsWithStudentInfo([]);
      return;
    }
    const fetchStudentInfo = async () => {
      try {
        const updatedSessions = await Promise.all(
          sessions.map(async (session) => {
            const studentId = session.bookings?.[0]?.student_id;

            if (studentId) {
              try {
                const response = await axiosInstance.get(`users/${studentId}/`);
                return {
                  ...session,
                  studentInfo: response.data
                };
              } catch (error) {
                console.error(`Error fetching student info for ID ${studentId}:`, error);
                return session;
              }
            }
            return session;
          })
        );
        console.log(updatedSessions)
        setSessionsWithStudentInfo(updatedSessions);
      } catch (error) {
        console.error('Error fetching student information:', error);
        setSessionsWithStudentInfo(sessions);
      }
    };

    if (sessions?.length > 0) {
      fetchStudentInfo();
    }
  }, [sessions]);

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

  const formatBookingStatus = (status) => {
    if (!status) return '';
    
    if (status === 'expired_unbooked') {
      return 'Session Expired (Unbooked)';
    }

    if (status === 'canceled_by_tutor') {
      return 'You have cancelled this session';
    }
    
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
      case 'listed':
        return 'bg-teal-50 text-teal-600 border border-teal-200';
      case 'unlisted':
        return 'bg-gray-50 text-gray-600 border border-gray-200';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  const isSessionListed = (session) => {
    const currentTime = new Date();
    const sessionStartTime = new Date(session.start_time);
    const threeHoursInMs = 3 * 60 * 60 * 1000;
    
    return !session.is_booked && (sessionStartTime - currentTime) >= threeHoursInMs;
  };

  const getListingStatus = (session) => {
    return isSessionListed(session) ? 'listed' : 'unlisted';
  };

  const handleCancelSession = async (session) => {
    if (session.is_booked === false) {
      try {
        await axiosInstance.delete(`tutor-availabilities/${session.id}/`);
        toast.success('Session deleted successfully');
        await fetchTutorAvailability(); // Wait for the fetch to complete
      } catch (error) {
        const backendMessage = error.response?.data?.message || error.response?.data?.error || 'Error deleting session';
        toast.error(backendMessage);
        fetchTutorAvailability();
        console.error('Error deleting session:', error);      
      }
      return;
    }
  
    const sessionStartTime = new Date(session.start_time);
    const currentTime = new Date();
  
    const allowedTimeBeforeSessionStart = session.session_type === 'trial' ? 60 : 120;
    const timeDifferenceInMinutes = (sessionStartTime - currentTime) / (1000 * 60);
  
    if (timeDifferenceInMinutes < allowedTimeBeforeSessionStart) {
      toast.error(
        `Cannot cancel ${session.session_type} session within ${
          session.session_type === 'trial' ? '1 hour' : '2 hours'
        } of start time.`
      );
      return;
    }
  
    if (session.bookings[0].booking_status === 'confirmed') {
      try {
        const response = await axiosInstance.patch(`tutor-availabilities/${session.id}/`, 
          {
            booking_status: 'canceled_by_tutor',
          }
        );
        if (response.status === 204) {
          toast.success('Session cancelled successfully');
        }
        await fetchTutorAvailability(); // Wait for the fetch to complete
      } catch (error) {
        const backendMessage = error.response?.data?.message || error.response?.data?.error || 'Error cancelling session';
        toast.error(backendMessage);
        console.error('Error cancelling session:', error);      
        await fetchTutorAvailability(); // Wait for the fetch to complete
      }
    } else {
      toast.error('Cannot cancel session with status other than "confirmed".');
      await fetchTutorAvailability(); // Wait for the fetch to complete
    }
  };

  const handleJoinSession = (bookingId) => () => {
    navigate('/video-call-setup', { state: { bookingId } });
  };

  if (!sessionsWithStudentInfo || sessionsWithStudentInfo.length === 0) {
    return (
      <EmptyState
        handleRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        title="No Sessions Added"
        description="You haven't added any teaching sessions yet. Add your available time slots to start accepting bookings."
        onAddSession={onAddSession}
        showButton={true}
        buttonText="Add Your First Session"
        bgColor="bg-blue-50"
        iconColor="text-blue-600"
        buttonColor="bg-blue-600 hover:bg-blue-700"
      />
    );
  }

  const isUnbooked = (session) => !session.bookings || session.bookings.length === 0;
  const getBookingStatus = (session) => session.bookings?.[0]?.booking_status;

  const getRoomNameStatus = (session) => {
    if (!session.bookings || session.bookings.length === 0) return null;
  
    const booking = session.bookings[0];
    const sessionStartTime = new Date(session.start_time);
    const sessionEndTime = new Date(session.end_time);
    const currentTime = new Date();
    const fiveMinutesBefore = new Date(sessionStartTime.getTime() - 5 * 60000);
    
    // Conditions for showing room name
    const isConfirmedStatus = booking.booking_status === 'confirmed' || 
                               booking.booking_status === 'ongoing';
    
    if (isConfirmedStatus) {
      // Session is currently happening (between start and end times)
      if (currentTime >= sessionStartTime && currentTime <= sessionEndTime) {
        return {
          type: 'showRoomName',
          roomName: booking.video_call_link
        };
      }
      
      // Within 5 minutes before session start
      if (currentTime >= fiveMinutesBefore && currentTime < sessionStartTime) {
        return {
          type: 'showRoomName',
          roomName: booking.video_call_link
        };
      }
      
      // More than 5 minutes before session start
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
      {sessionsWithStudentInfo.map((session) => (
        <div
          key={session.id}
          className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b">
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${getSessionTypeStyles(
                  session.session_type
                )}`}
              >
                {session.session_type}
              </span>
              {session.bookings && session.bookings[0] && session.bookings[0].booking_status && (
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(session.bookings[0].booking_status)}`}>
                  {formatBookingStatus(session.bookings[0].booking_status)}
                </span>
              )}
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(getListingStatus(session))}`}>
                {getListingStatus(session) === 'listed' ? 'Listed' : 'Unlisted'}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="w-5 h-5 mr-2 text-gray-400" />
              <div>
                <p className="font-medium">{formatLocalTime(session.start_time)}</p>
                <p className="text-sm text-gray-500">
                  Duration: {getSessionDuration(session.start_time, session.end_time)}
                </p>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Student Details */}
              {session.bookings?.length > 0 && session.studentInfo ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar
                      src={session.studentInfo.profile_image}
                      name={session.studentInfo.name || ''}
                      size={48}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Student: {session.studentInfo.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {session.studentInfo.country || 'Country not specified'}
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700">Languages spoken:</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {session.studentInfo?.language_spoken && session.studentInfo.language_spoken.length > 0 ? (
                            session.studentInfo.language_spoken.map((lang, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-gray-200 text-gray-700"
                              >
                                {lang.language} - {lang.proficiency}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-xs">Not Specified</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-600 text-center">
                          <span className="block text-lg font-medium mb-1">
                            {session.custom_status === 'expired_unbooked' ? (
                              <span className="text-yellow-600">Session Expired - No Bookings</span>
                            ) : (
                              'Unbooked'
                            )}
                          </span>
                          <span className="text-sm">
                            {session.custom_status === 'expired_unbooked' ? (
                              'This session was not booked within 3 hours of start time and is no longer visible to students.'
                            ) : (
                              'Note: The slot will be removed from listings if it remains unbooked within 3 hours of the scheduled time.'
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

              {/* Credits Info - Conditional Rendering */}
                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-900"> 
                    This session is valued at {session.credits_required} credits
                  </span>
                </div>
              {getBookingStatus(session) === 'completed' && (
                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-900"> 
                    {session.credits_required} Credits have been credited to your account
                  </span>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Session Language */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-xl">🌐</span>
                  <div>
                    <p className="font-medium text-gray-900">Language to Teach</p>
                    <p className="mt-1 text-gray-700">
                      {session.language_to_teach || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
              {session.bookings?.length > 0 && 
                (session.bookings[0]?.booking_status === 'confirmed' || session.bookings[0]?.booking_status === 'ongoing') && (
                  <button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center font-medium transition-colors duration-200"
                    onClick={handleJoinSession(session.bookings[0].id)}
                  >
                    <VideoIcon className="w-4 h-4 mr-2" />
                    Join Session
                  </button>
                )}
                {/* Cancel Button - Only show if unbooked or status is confirmed */}
                {(isUnbooked(session) || getBookingStatus(session) === 'confirmed' || session.is_booked === false) && (
                  <button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200"
                    onClick={() => handleCancelSession(session)}
                  >
                    Cancel Session
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Room Name Notification */}
          {(() => {
            const roomNameStatus = getRoomNameStatus(session);
            
            if (roomNameStatus) {
              if (roomNameStatus.type === 'showRoomName') {
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

export default SessionsList;