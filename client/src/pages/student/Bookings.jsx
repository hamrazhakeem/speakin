import React, { useState, useEffect } from 'react';
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import { useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import { useSelector } from 'react-redux';
import StudentBookingsList from '../../components/user/StudentBookingsList';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Bookings = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const { userId } = useSelector((state) => state.auth);
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudentSessions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('bookings/');
      const studentBookings = response.data.filter(
        (booking) => booking.student_id === userId
      );

      // For each booking, fetch corresponding availability and tutor details
      const sessionsWithDetails = await Promise.all(
        studentBookings.map(async (session) => {
          try {
            const tutorAvailabilityResponse = await axiosInstance.get(`tutor-availabilities/${session.availability}/`);
            const tutorUserResponse = await axiosInstance.get(`users/${tutorAvailabilityResponse.data.tutor_id}/`);
            const tutorResponse = await axiosInstance.get(`tutor-details/${tutorAvailabilityResponse.data.tutor_id}/`);

            return {
              ...session,
              tutorDetails: tutorResponse.data,
              availabilityDetails: tutorAvailabilityResponse.data,
              tutorUserResponse: tutorUserResponse.data
            };
          } catch (error) {
            console.error(`Error fetching details for session ${session.id}:`, error);
            return session;
          }
        })
      );
      setSessions(sessionsWithDetails);
    } catch (error) {
      console.error("Error fetching student sessions:", error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentSessions();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Profile Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Bookings</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your session bookings and upcoming classes
          </p>
        </div>

        {/* Navigation Tabs */}
        <nav className="max-w-4xl mx-auto mb-8 flex space-x-1 rounded-xl bg-blue-50 p-1">
          {[
            { label: 'Profile', path: '/profile' },
            { label: 'Security', path: '/password' },
            { label: 'Bookings', path: '/bookings', active: true },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200
                ${tab.active 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-200">
            {loading ? (
              <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
                <LoadingSpinner size="lg" className="text-blue-600" />
              </div>
            ) : (
              <StudentBookingsList 
                sessions={sessions} 
                fetchStudentSessions={fetchStudentSessions} 
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bookings;