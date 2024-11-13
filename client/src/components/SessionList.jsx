import React, { useState, useEffect } from 'react';
import { Clock, CreditCard, VideoIcon } from 'lucide-react';
import EmptyState from './EmptyState';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';
import Avatar from './Avatar';

const SessionsList = ({ sessions, onAddSession, fetchTutorAvailability }) => {
  const axiosInstance = useAxios();
  const [sessionsWithStudentInfo, setSessionsWithStudentInfo] = useState([]);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const updatedSessions = await Promise.all(
          sessions.map(async (session) => {
            // Check if session has bookings and get the student_id
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

  const getStatusStyles = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-600 border border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-600 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  const handleCancelSession = async (session) => {
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

    try {
      const response = await axiosInstance.delete(`delete-tutor-availabilities/${session.id}/`);
      if (response.status === 204) {
        toast.success('Session cancelled successfully');
      }
      fetchTutorAvailability();
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  };

  const handleJoinSession = (meetingLink) => {
    window.open(meetingLink, '_blank');
  };

  if (!sessionsWithStudentInfo || sessionsWithStudentInfo.length === 0) {
    return (
      <EmptyState
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

  return (
    <div className="space-y-6">
      {sessionsWithStudentInfo.map((session) => (
        <div
          key={session.start_time}
          className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
        >
          {/* Header Section */}
          <div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b">
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${getSessionTypeStyles(
                  session.session_type
                )}`}
              >
                {session.session_type}
              </span>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${getStatusStyles(session.status)}`}>
                {session.status}
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
              {session.bookings && session.studentInfo && (
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
              )}

              {/* Credits Info */}
              <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900"> 
                  You will get credited {session.credits_required} Credits upon successful completion 
                </span>
              </div>
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
                {session.status === 'booked' && (
                  <button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center font-medium transition-colors duration-200"
                    onClick={() => handleJoinSession(session.video_call_link)}
                  >
                    <VideoIcon className="w-4 h-4 mr-2" />
                    Join Session
                  </button>
                )}
                  <button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200"
                    onClick={() => handleCancelSession(session)}
                  >
                    Cancel
                  </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionsList;