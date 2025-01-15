import React, { useState, useEffect } from 'react';
import { Clock, CreditCard, RotateCw, VideoIcon, Filter, ChevronDown, ChevronUp, AlertCircle, Plus } from 'lucide-react';
import EmptyState from './EmptyState';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-hot-toast';
import Avatar from './Avatar';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './ui/LoadingSpinner';

const SessionsList = ({ sessions, onAddSession, fetchTutorAvailability }) => {
  const axiosInstance = useAxios();
  const [sessionsWithStudentInfo, setSessionsWithStudentInfo] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showRules, setShowRules] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cancellingSessionIds, setCancellingSessionIds] = useState(new Set());

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTutorAvailability();
    setTimeout(() => setIsRefreshing(false), 1000); // Ensure animation plays for at least 1 second
  };

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        if (!sessions || sessions.length === 0) {
          setSessionsWithStudentInfo([]);
        } else {
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
          setSessionsWithStudentInfo(updatedSessions);
          console.log(updatedSessions)
        }
      } catch (error) {
        console.error('Error fetching student information:', error);
        setSessionsWithStudentInfo(sessions);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchStudentInfo();
    
  }, [sessions]);

  const formatLocalTime = (utcTime) => {
    const date = new Date(utcTime);
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const isSessionMissed = (session) => {
    const sessionStartTime = new Date(session.start_time);
    const currentTime = new Date();
  
    // Add 5 minutes to the session start time
    const fiveMinutesAfterStartTime = new Date(sessionStartTime.getTime() + 5 * 60000);
  
    // Check if current time is greater than 5 minutes after start time
    const isPastFiveMinutes = currentTime > fiveMinutesAfterStartTime;
    console.log('session bookings', session.bookings, session.id)
    // Check if both student and tutor did not join within 5 minutes
    const isStudentMissed = session.is_booked && session.bookings[0]?.student_joined_within_5_min === false;
    const isTutorMissed = session.is_booked && session.bookings[0]?.tutor_joined_within_5_min === false;
    
  
    return isPastFiveMinutes && isStudentMissed && isTutorMissed;
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

  const formatBookingStatus = (session) => {
    const bookingStatus = session.bookings[0].booking_status;

    if (!bookingStatus) return '';
    
    if (isSessionMissed(session)) {
      return 'Session Missed: Both Tutor and Student Did Not Join';
    }
    
    if (bookingStatus === 'expired_unbooked') {
      return 'Session Expired (Unbooked)';
    }
  
    if (bookingStatus === 'canceled_by_tutor') {
      return 'You have cancelled this session';
    }
    
    if (bookingStatus === 'no_show_by_tutor') {
      return 'Session Missed: Unable to Attend';
    }
    
    return bookingStatus
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
      case 'listed':
        return 'bg-teal-50 text-teal-700 border border-teal-200';
      case 'unlisted':
        return 'bg-slate-50 text-slate-700 border border-slate-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
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
    setCancellingSessionIds(prev => new Set([...prev, session.id]));
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
      } finally {
        // Remove session ID from loading state
        setCancellingSessionIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(session.id);
          return newSet;
        });
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
      setCancellingSessionIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(session.id);
        return newSet;
      });
      return;
    }
  
    if (session.bookings[0].booking_status === 'confirmed') {
      try {
        await axiosInstance.patch(`tutor-availabilities/${session.id}/`, 
          {
            booking_status: 'canceled_by_tutor',
          }
        );
        toast.success('Session cancelled successfully');
        await fetchTutorAvailability(); // Wait for the fetch to complete
      } catch (error) {
        const backendMessage = error.response?.data?.message || error.response?.data?.error || 'Error cancelling session';
        toast.error(backendMessage);
        console.error('Error cancelling session:', error);      
        await fetchTutorAvailability(); // Wait for the fetch to complete
      } finally {
        // Remove session ID from loading state
        setCancellingSessionIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(session.id);
          return newSet;
        });
      }
    } else {
      toast.error('Cannot cancel session with status other than "confirmed".');
      await fetchTutorAvailability();
      // Remove session ID from loading state
      setCancellingSessionIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(session.id);
        return newSet;
      });
    }
  };

  const handleJoinSession = (bookingId) => () => {
    navigate('/video-call/setup', { state: { bookingId } });
  };

  if (loading || sessionsWithStudentInfo === null) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
        <LoadingSpinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  if (sessionsWithStudentInfo.length === 0) {
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
    const sessionStartTime = new Date(session.start_time);
    const sessionEndTime = new Date(session.end_time);
    const currentTime = new Date();
    const fiveMinutesBefore = new Date(sessionStartTime.getTime() - 5 * 60000);
    const fiveMinutesAfter = new Date(sessionStartTime.getTime() + 5 * 60000);
    
    const isConfirmedStatus = session.bookings?.[0]?.booking_status === 'confirmed' || 
                             session.bookings?.[0]?.booking_status === 'ongoing';
    
    if (isConfirmedStatus) {
      // Show room name between 5 minutes before and 5 minutes after session start
      if (currentTime >= fiveMinutesBefore && currentTime <= fiveMinutesAfter) {
        return {
          type: 'showRoomName',
          roomName: session.bookings[0].video_call_link
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

    const sessionStartTime = new Date(session.start_time);
    const currentTime = new Date();
    const fiveMinutesBefore = new Date(sessionStartTime.getTime() - 5 * 60000);
    const showJoinButton = currentTime >= fiveMinutesBefore;
    const isLoading = cancellingSessionIds.has(session.id);

    return (
      <div className="flex flex-col gap-3">
        {session.bookings?.length > 0 && 
          (session.bookings[0]?.booking_status === 'confirmed' || session.bookings[0]?.booking_status === 'ongoing') && 
          showJoinButton && (
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors duration-200"
              onClick={handleJoinSession(session.bookings[0].id)}
            >
              <VideoIcon className="w-4 h-4" />
              Join Session
            </button>
        )}
        {/* Cancel Button - Only show if unbooked or status is confirmed */}
        {(isUnbooked(session) || getBookingStatus(session) === 'confirmed' || session.is_booked === false) && (
          <button
            className="w-full bg-red-50 text-red-600 hover:bg-red-100 px-4 py-3 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={() => handleCancelSession(session)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="text-red-600" />
              </>
            ) : (
              'Cancel Session'
            )}
          </button>
        )}
        {session.bookings?.[0]?.booking_status === 'completed' && (
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors duration-200">
            View Review
          </button>
        )}
      </div>
    );
  };

  const determineCustomStatus = (session) => {
    const currentTime = new Date();
    const startTime = new Date(session.start_time);
  
    // Calculate the time 3 hours before the start time
    const threeHoursBeforeStart = new Date(startTime.getTime() - 3 * 60 * 60 * 1000);
  
    // Check if current time is after 3 hours before start time and session is unbooked with no bookings
    if (
      currentTime >= threeHoursBeforeStart && // Current time is after 3 hours before the start time
      !session.is_booked
    ) {
      return 'expired_unbooked';
    }
    return 'normal';
  };
  

  // Define all possible session statuses
  const sessionStatuses = [
    { value: 'all', label: 'All Sessions' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'canceled_by_tutor', label: 'Canceled by Me' },
    { value: 'canceled_by_student', label: 'Canceled by Student' },
    { value: 'no_show_by_tutor', label: 'No Show by Me' },
    { value: 'no_show_by_student', label: 'No Show by Student' },
    { value: 'listed', label: 'Listed' },
    { value: 'unlisted', label: 'Unlisted' }
  ];

  // Update the filtering logic to use sessionsWithStudentInfo instead of sessions
  const filteredSessions = sessionsWithStudentInfo?.filter(session => {
    if (selectedStatus === 'all') return true;
    if (selectedStatus === 'listed') return isSessionListed(session);
    if (selectedStatus === 'unlisted') return !isSessionListed(session);
    return session.bookings?.[0]?.booking_status === selectedStatus;
  }) || [];

  return (
    <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <button 
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
          onClick={onAddSession}
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          Add New Session
        </button>
      </div>

      {/* Header with Filter and Stats */}
      <div className="flex flex-col gap-6">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Teaching Sessions</h2>
            <button
              onClick={handleRefresh}
              className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors"
              disabled={isRefreshing}
            >
              <RotateCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 
                bg-white text-gray-900 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                transition-colors shadow-sm appearance-none cursor-pointer"
            >
              {sessionStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {sessionStatuses.slice(1).map(status => {
              const count = sessionsWithStudentInfo?.filter(session => {
                if (status.value === 'listed') return isSessionListed(session);
                if (status.value === 'unlisted') return !isSessionListed(session);
                return session.bookings?.[0]?.booking_status === status.value;
              }).length || 0;
              return (
                <div 
                  key={status.value}
                  className="flex flex-col items-center p-3 rounded-lg bg-gray-50"
                >
                  <span className="text-2xl font-semibold text-gray-900">{count}</span>
                  <span className="text-sm text-gray-600 text-center">{status.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Rules Button */}
      <button
        onClick={() => setShowRules(!showRules)}
        className="flex items-center gap-2 px-4 py-3 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors w-full"
      >
        <AlertCircle className="w-5 h-5" />
        <span className="flex-1 text-left font-medium">Important Session Rules for Tutors - Please Read</span>
        {showRules ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
            {/* Rules section at the bottom */}
            {showRules && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
          <div className="flex items-start space-x-4 mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Session Rules and Policies for Tutors
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">
                    You can join your session starting <span className="font-medium">5 minutes before</span> the scheduled start time.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">
                    If you don't join within <span className="font-medium">5 minutes after</span> the session start time, it will be marked as a "no-show" and you won't receive credits for the session.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">
                    If both you and the student fail to join within the first 5 minutes, the session credits will be retained by the platform.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">
                    For your no-shows, the student will receive a <span className="font-medium">full refund plus 10% bonus credits</span> as compensation, and this may affect your tutor rating.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">
                    Trial sessions cannot be canceled within <span className="font-medium">1 hour</span> of the start time. Standard sessions cannot be canceled within <span className="font-medium">2 hours</span> of the start time.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">
                    If you cancel a session, the student will receive a full refund, and frequent cancellations may impact your tutor status.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">
                    Unbooked sessions will be automatically unlisted <span className="font-medium">3 hours</span> before the start time.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-600 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">
                    For standard sessions, you'll receive <span className="font-medium">80%</span> of the session credits, with <span className="font-medium">20%</span> retained as a platform fee.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">
                    For trial sessions, you'll receive <span className="font-medium">100%</span> of the session credits with no platform fee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Grid */}
      {!filteredSessions || filteredSessions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No sessions found
          </h3>
          <p className="text-gray-600">
            {sessions.length === 0 
              ? "You haven't created any sessions yet. Click 'Add New Session' to get started."
              : "Try selecting a different status filter to see more sessions."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 max-h-[500px] overflow-y-auto pr-2">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex flex-wrap justify-start items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100 gap-2">
                <span
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium capitalize ${getSessionTypeStyles(
                    session.session_type
                  )}`}
                >
                  {session.session_type}
                </span>
                {session.bookings && session.bookings[0] && session.bookings[0].booking_status && (
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(session.bookings[0].booking_status)}`}>
                    {formatBookingStatus(session)}
                  </span>
                )}
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(getListingStatus(session))}`}>
                  {getListingStatus(session) === 'listed' ? 'Listed' : 'Unlisted'}
                </span>
              </div>

              <div className="flex items-center text-gray-700 text-sm sm:text-base">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-400" />
                <div>
                  <p className="font-medium">{formatLocalTime(session.start_time)}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Duration: {getSessionDuration(session.start_time, session.end_time)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mt-4">
                <div className="space-y-4 sm:space-y-6">
                  {session.is_booked && session.bookings?.length > 0 && session.studentInfo ? (
                    <div className="bg-gray-50 rounded-xl p-3 sm:p-5 border border-gray-100">
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <Avatar
                          src={session.studentInfo.profile_image}
                          name={session.studentInfo.name || ''}
                          size={40}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            Student: {session.studentInfo.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {session.studentInfo.country || 'Country not specified'}
                          </p>
                          <div className="mt-2 sm:mt-3">
                            <p className="text-xs sm:text-sm font-medium text-gray-700">Languages spoken:</p>
                            <div className="mt-1 sm:mt-2 flex flex-wrap gap-1 sm:gap-2">
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
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-600 text-center">
                          <span className="block text-lg font-medium mb-1">
                            {determineCustomStatus(session) === 'expired_unbooked' ? (
                              <span className="text-yellow-600">Session Expired - No Bookings</span>
                            ) : (
                              'Unbooked'
                            )}
                          </span>
                          <span className="text-sm">
                            {determineCustomStatus(session) === 'expired_unbooked' ? (
                              'This session was not booked within 3 hours of start time and is no longer visible to students.'
                            ) : (
                              'Note: The slot will be removed from listings if it remains unbooked within 3 hours of the scheduled time.'
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {(isSessionMissed(session)) && (
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
                      <CreditCard className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-gray-900"> 
                      {session.credits_required} credits have been retained by the platform as per no-show policy
                      </span>
                    </div>
                  )}

                  {(getBookingStatus(session) === 'completed' || getBookingStatus(session) === 'no_show_by_student') && (
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
                      <CreditCard className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-gray-900"> 
                        {session.session_type === 'standard' ? (
                          <>
                          This session was valued at {session.credits_required} credits
                          <br />
                          <span className="text-sm text-gray-600">
                            • 80% ({Math.floor(session.credits_required * 0.8)} credits) credited to your account
                            • 20% Platform fee: {Math.floor(session.credits_required * 0.2)} credits
                          </span>
                          </>
                        ) : (
                          `${session.credits_required} Credits have been credited to your account`
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">🌐</span>
                      <div>
                        <p className="font-medium text-gray-900">Language to Teach</p>
                        <p className="mt-1 text-gray-700">
                          {session.language_to_teach || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {renderActionButtons(session)}
                </div>
              </div>

              {(() => {
                const roomNameStatus = getRoomNameStatus(session);
              
                if (roomNameStatus) {
                  if (roomNameStatus.type === 'showRoomName') {
                    const cleanedRoomName = cleanRoomName(roomNameStatus.roomName);
                    return (
                      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-sm sm:text-base">
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
      )}
    </div>
  );
};

export default SessionsList;