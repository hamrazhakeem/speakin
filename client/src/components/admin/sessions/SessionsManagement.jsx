import React, { useState, useEffect } from 'react';
import { format, isValid } from 'date-fns';
import AdminButton from '../ui/AdminButton';
import useAxios from '../../../hooks/useAxios';
import LoadingSpinner from '../../common/LoadingSpinner';
import SessionCard from './SessionCard';

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
                  users={users}
                />
              ))
            : data.bookings.map((booking) => (
                <SessionCard
                  key={booking.id}
                  session={booking}
                  type="booking"
                  users={users}
                />
              ))}
        </div>
      )}
    </div>
  );
};

export default SessionsManagement;
