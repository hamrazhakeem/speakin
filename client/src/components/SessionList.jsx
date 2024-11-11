import React, { useState } from 'react';
import { Clock, CreditCard } from 'lucide-react';
import EmptyState from './EmptyState';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';

const SessionsList = ({ sessions, onAddSession, fetchTutorAvailability }) => {
    const axiosInstance = useAxios()

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

  const handleCancelSession = async (sessionId) => {
    try {
        const response = await axiosInstance.delete(`delete-tutor-availabilities/${sessionId}/`)
      if (response.status === 204) {
        toast.success('Session cancelled successfully');
      }
      fetchTutorAvailability();
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  };


  if (!sessions || sessions.length === 0) {
    return <EmptyState
    title="No Sessions Added"
    description="You haven't added any teaching sessions yet. Add your available time slots to start accepting bookings."
    onAddSession={onAddSession}
    showButton={true}
    buttonText="Add Your First Session"
    bgColor="bg-blue-50"
    iconColor="text-blue-600"
    buttonColor="bg-blue-600 hover:bg-blue-700"
  />
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div
          key={session.start_time}
          className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getSessionTypeStyles(
                  session.session_type
                )}`}
              >
                {session.session_type}
              </span>
            </div>
            <div className="text-sm font-medium text-gray-500">
              {session.status === 'available' ? (
                <span className="text-green-600">● Available</span>
              ) : session.status === 'booked' ? (
                <span className="text-yellow-600">● Booked</span>
              ) : (
                <span className="text-gray-600">● {session.status}</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <Clock className="w-5 h-5 mr-2 text-gray-400" />
              <div>
                <p className="font-medium">{formatLocalTime(session.start_time)}</p>
                <p className="text-sm text-gray-500">
                  Duration: {getSessionDuration(session.start_time, session.end_time)}
                </p>
              </div>
            </div>

            <div className="flex items-center text-gray-700">
              <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
              <div>
                <span className="font-medium">Student will pay {session.credits_required} Credits</span>
              </div>
            </div>

            {(session.status === 'available' || session.status === 'booked') && (
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                onClick={() => handleCancelSession(session.id)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionsList;