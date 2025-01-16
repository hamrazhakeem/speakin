import React, { useState } from 'react';
import { Clock, CreditCard, RotateCw, VideoIcon, Filter, ChevronDown, ChevronUp, AlertCircle, Calendar } from 'lucide-react';
import EmptyState from '../EmptyState';
import useAxios from '../../hooks/useAxios';
import { toast } from 'react-hot-toast';
import Avatar from '../Avatar';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../ui/LoadingSpinner';

const StudentBookingsList = ({ sessions, fetchStudentSessions }) => {
  const axiosInstance = useAxios();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showRules, setShowRules] = useState(false);
  const [cancellingSessionIds, setCancellingSessionIds] = useState(new Set());

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

    setCancellingSessionIds(prev => new Set(prev).add(session.id));
  
    try {
      await axiosInstance.patch(`tutor-availabilities/${session.availability}/`, {
        booking_status: 'canceled_by_student',
      });
  
      toast.success('Session cancelled successfully');
      fetchStudentSessions();
    } catch (error) {
      console.log(error)
      // Extract backend message and display it
      const backendMessage = error.response?.data?.message || error.response?.data?.error || 'Error cancelling session';
      toast.error(backendMessage);
      console.error('Error cancelling session:', error);
    } finally {
      // Remove session ID from cancelling set
      setCancellingSessionIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(session.id);
        return newSet;
      });
    }
  };

  const handleJoinSession = (bookingId) => {
    navigate('/video-call/setup', { state: { bookingId } });
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
          <span className="font-medium text-gray-900">
            {creditsRequired} Credits have been retained by the platform as per no-show policy
          </span>
        </div>
      );
    }

    const bonusCredits = Math.floor(creditsRequired * 0.1);
    const totalRefund = creditsRequired + bonusCredits;
  
    if (isCanceled) {
      return (
        <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
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
        <span className="font-medium text-gray-900">
          {creditsRequired} Credits Paid
        </span>
      </div>
    );
  };
  

  // Define all possible booking statuses
  const bookingStatuses = [
    { value: 'all', label: 'All Sessions' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'canceled_by_tutor', label: 'Canceled by Tutor' },
    { value: 'canceled_by_student', label: 'Canceled by Student' },
    { value: 'no_show_by_tutor', label: 'No Show by Tutor' },
    { value: 'no_show_by_student', label: 'No Show by Student' }
  ];

  // Filter sessions based on selected status
  const filteredSessions = sessions.filter(session => 
    selectedStatus === 'all' ? true : session.booking_status === selectedStatus
  );

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

  // Show loading state when sessions is null (initial load)
  if (sessions === null) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
        <LoadingSpinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  // Show empty state only when we have confirmed there are no sessions
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Calendar className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No bookings found
        </h3>
        <p className="text-gray-600">
          You haven't booked any sessions yet. Browse available tutors to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section - Made more responsive */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Session Details</h2>
          <button
            onClick={handleRefresh}
            className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors"
            disabled={isRefreshing}
          >
            <RotateCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Filter dropdown - Full width on mobile */}
        <div className="relative w-full sm:w-[200px]">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 
              bg-white text-gray-900 focus:border-blue-500 focus:ring-2 
              focus:ring-blue-200 transition-colors shadow-sm appearance-none cursor-pointer"
          >
            {bookingStatuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 pointer-events-none" />
        </div>
      </div>

      {/* Stats Grid - Improved mobile layout */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {bookingStatuses.slice(1).map(status => (
            <div 
              key={status.value}
              className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl sm:text-2xl font-semibold text-gray-900">{
                sessions.filter(session => session.booking_status === status.value).length
              }</span>
              <span className="text-xs sm:text-sm text-gray-600 text-center">{status.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rules Button - Full width and more touch-friendly */}
      <button
        onClick={() => setShowRules(!showRules)}
        className="flex items-center gap-2 px-4 py-4 bg-amber-50 text-amber-700 
          rounded-xl hover:bg-amber-100 transition-colors w-full touch-manipulation"
      >
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1 text-left font-medium">Important Session Rules - Please Read</span>
        {showRules ? <ChevronUp className="w-5 h-5 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 flex-shrink-0" />}
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
          Session Rules and Policies for Students
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
              If you don't join within <span className="font-medium">5 minutes after</span> the session start time, the session will be marked as "no-show" and you won't receive a refund.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
            <p className="text-gray-600 text-sm">
              If both you and the tutor fail to join within the first 5 minutes, the session credits will be retained by the platform.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0" />
            <p className="text-gray-600 text-sm">
              If the tutor doesn't join the session, you will receive a <span className="font-medium">full refund plus 10% bonus credits</span> as compensation.
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
              If you cancel a session, the refund policy will apply based on the cancellation time, and frequent cancellations may impact your account status.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-600 flex-shrink-0" />
            <p className="text-gray-600 text-sm">
              For standard sessions, <span className="font-medium">20%</span> of the credits you pay will be retained as a platform fee, while <span className="font-medium">80%</span> will go to the tutor.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
            <p className="text-gray-600 text-sm">
              For trial sessions, no platform fee will be charged, and <span className="font-medium">100%</span> of the credits you pay will go to the tutor.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


      {/* Session Cards - Improved mobile layout */}
      {filteredSessions?.length > 0 ? (
        <div className="grid gap-4 max-h-[500px] overflow-y-auto pr-2">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 
                hover:shadow-lg transition-shadow duration-200"
            >
              {/* Session Header - Stacked on mobile */}
              <div className="border-b border-gray-100 pb-4 sm:pb-6 mb-4 sm:mb-6">
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1.5 rounded-xl text-sm font-medium capitalize ${
                      getSessionTypeStyles(session.availabilityDetails.session_type)
                    }`}>
                      {session.availabilityDetails.session_type}
                    </span>
                    <span className={`px-3 py-1.5 rounded-xl text-sm font-medium capitalize ${
                      getStatusStyles(session.booking_status)
                    }`}>
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
              </div>

              {/* Session Details - Single column on mobile */}
              <div className="grid gap-4 sm:gap-8 md:grid-cols-2">
                {/* Tutor Info Section */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar
                        src={session.tutorUserResponse.profile_image}
                        name={session.tutorDetails?.speakin_name || ''}
                        size={48}
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          {session.tutorDetails?.speakin_name}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          {session.tutorUserResponse.country || 'Country not specified'}
                        </p>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Languages spoken:</p>
                          <div className="flex flex-wrap gap-2">
                            {session.tutorDetails?.language_spoken.map((lang, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium 
                                  bg-white border border-gray-200 text-gray-700"
                              >
                                {lang.language} - {lang.proficiency}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Credits Info - More compact on mobile */}
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        {renderCreditInfo(session)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session Actions Section */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl flex-shrink-0">🌐</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">Session Language</p>
                        <p className="mt-1 text-gray-700 truncate">
                          {session.availabilityDetails.language_to_teach || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Full width and more touch-friendly */}
                  {!isSessionMissed(session) && (
                    <div className="flex flex-col gap-3">
                      {(session.booking_status === 'confirmed' || session.booking_status === 'ongoing') && 
                        (() => {
                          const sessionStartTime = new Date(session.availabilityDetails.start_time);
                          const currentTime = new Date();
                          const fiveMinutesBefore = new Date(sessionStartTime.getTime() - 5 * 60000);
                          const showJoinButton = currentTime >= fiveMinutesBefore;

                          return showJoinButton && (
                            <button
                              onClick={() => handleJoinSession(session.id)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-4 
                                rounded-xl flex items-center justify-center gap-2 font-medium 
                                transition-colors duration-200 touch-manipulation"
                            >
                              <VideoIcon className="w-4 h-4" />
                              Join Session
                            </button>
                          );
                        })()
                      }
                      {session.booking_status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelSession(session)}
                          disabled={cancellingSessionIds.has(session.id)}
                          className="w-full bg-red-50 text-red-600 hover:bg-red-100 px-4 py-4 
                            rounded-xl font-medium transition-colors duration-200 touch-manipulation
                            disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center justify-center gap-2"
                        >
                          {cancellingSessionIds.has(session.id) ? (
                            <>
                              <LoadingSpinner size="sm" className="text-red-600" />
                            </>
                          ) : (
                            'Cancel Session'
                          )}
                        </button>
                      )}
                      {session.booking_status === 'completed' && (
                        <button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-4 
                            rounded-xl font-medium transition-colors duration-200 touch-manipulation"
                        >
                          Leave Review
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Room Name Section - Improved readability on mobile */}
              {(() => {
                const roomNameStatus = getRoomNameStatus(session);
                
                if (roomNameStatus) {
                  if (roomNameStatus.type === 'showRoomName' && !isSessionMissed(session)) {
                    const cleanedRoomName = cleanRoomName(roomNameStatus.roomName);
                    return (
                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                        <div className="bg-blue-50 rounded-xl p-4 sm:p-6">
                          <p className="font-semibold text-blue-900 mb-3">
                            🔐 Secure Room Name Available
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <code className="flex-1 bg-white px-4 py-3 rounded-lg text-blue-900 
                              select-all border border-blue-200 break-all text-sm sm:text-base">
                              {cleanedRoomName}
                            </code>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(cleanedRoomName);
                                toast.success('Room name copied!');
                              }}
                              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm 
                                hover:bg-blue-700 transition-colors touch-manipulation"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (roomNameStatus.type === 'waitingMessage') {
                    return (
                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                        <div className="bg-blue-50 rounded-xl p-4 sm:p-6">
                          <p className="text-blue-900 font-medium">
                            🕒 {roomNameStatus.timeMessage}
                          </p>
                        </div>
                      </div>
                    );
                  }
                }
                return null;
              })()}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          handleRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          title={sessions.length === 0 ? "No Bookings Found" : "No Sessions Match the Selected Filter"}
          description={sessions.length === 0 
            ? "You haven't booked any slots yet. Browse our tutors to find the perfect match for your learning needs."
            : "Try selecting a different status filter to see more sessions."}
          showButton={sessions.length === 0}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
      )}
    </div>
  );
};

export default StudentBookingsList;