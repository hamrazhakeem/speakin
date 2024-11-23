import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import { useSelector } from 'react-redux';
import StudentBookingsList from '../components/StudentBookingsList';

const StudentBookingsPage = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const { userId } = useSelector((state) => state.auth);
  const [sessions, setSessions] = useState([]);

  const fetchStudentSessions = async () => {
    try {
      // Fetch all bookings from the backend
      const response = await axiosInstance.get('bookings/');
  
      // Filter bookings for the current student
      const studentBookings = response.data.filter(
        (booking) => booking.student_id === userId
      );

      // For each booking, fetch corresponding availability and tutor details
      const sessionsWithDetails = await Promise.all(
        studentBookings.data.map(async (session) => {
          try {
            // Fetch session details from TutorAvailability
            const tutorAvailabilityResponse = await axiosInstance.get(`tutor-availabilities/${session.availability}/`);

            const tutorUserResponse = await axiosInstance.get(`users/${tutorAvailabilityResponse.data.tutor_id}/`)

            // Fetch tutor details
            const tutorResponse = await axiosInstance.get(`tutor-details/${tutorAvailabilityResponse.data.tutor_id}/`);

            // Combine the session, tutor, and availability details
            return {
              ...session,
              tutorDetails: tutorResponse.data,
              availabilityDetails: tutorAvailabilityResponse.data,
              tutorUserResponse: tutorUserResponse.data
            };
          } catch (error) {
            console.error(`Error fetching details for session ${session.id}:`, error);
            return session;  // If something goes wrong, return the session with missing details
          }
        })
      );
      console.log(sessionsWithDetails)
      // Set combined sessions data
      setSessions(sessionsWithDetails);
    } catch (error) {
      console.error("Error fetching student sessions:", error);
    }
  };

  useEffect(() => {
    fetchStudentSessions();
  }, [userId]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800">My Bookings</h1>
            </div>

            <nav className="flex space-x-6 mb-8 border-b pb-4">
              <button className="text-gray-600 text-lg hover:text-green-600 transition-colors" onClick={() => navigate('/profile')}>Profile</button>
              <button className="text-gray-600 text-lg hover:text-green-600 transition-colors" onClick={() => navigate('/student-password-change')}>Security</button>
              <button className="text-green-600 font-semibold text-lg hover:text-green-800 transition-colors" onClick={() => navigate('/bookings')}>Bookings</button>
              <button className="text-gray-600 text-lg hover:text-green-600 transition-colors">Refer a friend</button>
            </nav>

            <div className="mb-6 flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
                <select className="px-4 py-2 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-green-500">
                  <option value="all">All Sessions</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

          <StudentBookingsList sessions={sessions} fetchStudentSessions={fetchStudentSessions} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentBookingsPage;