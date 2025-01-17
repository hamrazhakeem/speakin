import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { format, isValid } from 'date-fns';
import AdminButton from '../ui/AdminButton';
import useAxios from '../../../hooks/useAxios';
import LoadingSpinner from '../../common/LoadingSpinner';

const SessionsManagement = () => {
  const [data, setData] = useState({ availabilities: [], bookings: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('availabilities');
  const [users, setUsers] = useState({ tutors: {}, students: {} });
  const axiosInstance = useAxios();

  const fetchSessions = async () => {
    try {
      const [availabilities, bookings] = await Promise.all([
        axiosInstance.get('tutor-availabilities/'),
        axiosInstance.get('bookings/')
      ]);

      const tutorIds = new Set(availabilities.data.map(a => a.tutor_id));
      const studentIds = new Set(bookings.data.map(b => b.student_id));
      
      const [tutorRes, studentRes] = await Promise.all([
        Promise.all([...tutorIds].map(id => axiosInstance.get(`users/${id}/`))),
        Promise.all([...studentIds].map(id => axiosInstance.get(`users/${id}/`)))
      ]);

      setUsers({
        tutors: Object.fromEntries(tutorRes.map(t => [t.data.id, t.data])),
        students: Object.fromEntries(studentRes.map(s => [s.data.id, s.data]))
      });
      
      setData({ availabilities: availabilities.data, bookings: bookings.data });
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    const date = new Date(timeStr);
    return isValid(date) ? format(date, 'MMM dd, yyyy hh:mm a') : 'Invalid Date';
  };

  const SessionCard = ({ session, type }) => {
    const user = type === 'availability' 
      ? users.tutors[session.tutor_id]
      : users.students[session.student_id];

    const startTime = session.start_time || session.availabilityDetails?.start_time;
    const endTime = session.end_time || session.availabilityDetails?.end_time;

    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden">
              {user?.profile_image ? (
                <img 
                  src={user.profile_image} 
                  alt={user?.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white bg-zinc-700">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-white">
                {type === 'availability'
                  ? user?.tutor_details?.speakin_name
                  : user?.name || 'Unknown User'}
              </h3>
              <p className="text-sm text-zinc-400">{user?.email || 'No email'}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {type === 'availability' ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Status:</span>
                <span className="text-white">
                  {session.is_booked ? 'Booked' : 'Available'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Language:</span>
                <span className="text-white">{session.language_to_teach}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Start Time:</span>
                <span className="text-white">{formatTime(startTime)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">End Time:</span>
                <span className="text-white">{formatTime(endTime)}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Status:</span>
                <span className="text-white">{formatStatus(session.booking_status)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Availability ID:</span>
                <span className="text-white">{session.availability}</span>
              </div>
              <div className="text-sm text-zinc-400 mt-4 mb-2">Participant Status:</div>
              <div className="space-y-2">
                <ParticipantStatus
                  role="Student"
                  joined={session.student_joined_within_5_min}
                  joinTime={session.student_joined_at}
                />
                <ParticipantStatus
                  role="Tutor"
                  joined={session.tutor_joined_within_5_min}
                  joinTime={session.tutor_joined_at}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const ParticipantStatus = ({ role, joined, joinTime }) => (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-400">{role}</span>
      <div className="flex items-center gap-2">
        {joinTime && <span className="text-white">{formatTime(joinTime)}</span>}
        {joined ? (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        ) : (
          <>
            <div className='text-white'>Not joined</div>
            <XCircle className="w-4 h-4 text-red-500" />
          </>
        )}
      </div>
    </div>
  );

  const TabButton = ({ label, isActive, onClick }) => (
    <AdminButton
      variant="tab"
      active={isActive}
      onClick={onClick}
      size="sm"
    >
      {label}
    </AdminButton>
  );

  const getStatusStyle = (status) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      ongoing: 'bg-blue-100 text-blue-800',
      completed: 'bg-purple-100 text-purple-800',
      canceled: 'bg-orange-100 text-orange-800',
      no_show: 'bg-red-100 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return styles[status] || styles.default;
  };

  const formatStatus = (status) => 
    status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Sessions</h1>
          <p className="text-zinc-400">View and manage all sessions and availabilities</p>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg">
          <TabButton
            label="Availabilities"
            isActive={activeTab === 'availabilities'}
            onClick={() => setActiveTab('availabilities')}
          />
          <TabButton
            label="Bookings"
            isActive={activeTab === 'bookings'}
            onClick={() => setActiveTab('bookings')}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" className="text-white" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === 'availabilities'
            ? data.availabilities.map((availability) => (
                <SessionCard
                  key={availability.id}
                  session={availability}
                  type="availability"
                />
              ))
            : data.bookings.map((booking) => (
                <SessionCard
                  key={booking.id}
                  session={booking}
                  type="booking"
                />
              ))}
        </div>
      )}
    </div>
  );
};

export default SessionsManagement;
