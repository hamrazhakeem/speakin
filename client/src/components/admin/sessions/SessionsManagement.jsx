import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import LoadingSpinner from '../../common/ui/LoadingSpinner';
import SessionCard from './SessionCard';
import AdminButton from '../ui/AdminButton';
import { adminApi } from '../../../api/adminApi';

const SessionsManagement = () => {
  const [data, setData] = useState({ availabilities: [], bookings: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('availabilities');
  const [users, setUsers] = useState({ tutors: {}, students: {} });
  const axiosInstance = useAxios();

  const fetchSessions = async () => {
    try {
      const [availabilities, bookings] = await Promise.all([
        adminApi.getTutorAvailabilities(axiosInstance),
        adminApi.getBookings(axiosInstance)
      ]);

      const tutorIds = new Set(availabilities.map(a => a.tutor_id));
      const studentIds = new Set(bookings.map(b => b.student_id));
      
      const [tutorRes, studentRes] = await Promise.all([
        Promise.all([...tutorIds].map(id => adminApi.getUserDetails(axiosInstance, id))),
        Promise.all([...studentIds].map(id => adminApi.getUserDetails(axiosInstance, id)))
      ]);

      setUsers({
        tutors: Object.fromEntries(tutorRes.map(t => [t.id, t])),
        students: Object.fromEntries(studentRes.map(s => [s.id, s]))
      });
      
      setData({ availabilities, bookings });
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

  const renderEmptyState = () => (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center min-h-[400px]">
      <p className="text-lg text-zinc-400 mb-2">
        No {activeTab === 'availabilities' ? 'availabilities' : 'bookings'} found
      </p>
      <p className="text-sm text-zinc-500">
        {activeTab === 'availabilities' 
          ? 'No tutors have created any availabilities yet'
          : 'No sessions have been booked yet'}
      </p>
    </div>
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
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" className="text-white" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === 'availabilities' 
            ? (data.availabilities.length === 0 
                ? renderEmptyState()
                : data.availabilities.map((availability) => (
                    <SessionCard
                      key={availability.id}
                      session={availability}
                      type="availability"
                      users={users}
                    />
                  )))
            : (data.bookings.length === 0
                ? renderEmptyState()
                : data.bookings.map((booking) => (
                    <SessionCard
                      key={booking.id}
                      session={booking}
                      type="booking"
                      users={users}
                    />
                  )))
          }
        </div>
      )}
    </div>
  );
};

export default SessionsManagement;
