import React, { useState, useEffect } from 'react';
import useAxios from '../../../../hooks/useAxios';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import StudentBookingsList from './StudentBookingsList';
import LoadingSpinner from '../../../common/ui/LoadingSpinner';
import NavigationTabs from '../../common/ui/profile/NavigationTabs';
import ReportModal from './ReportModal';
import { studentApi } from '../../../../api/studentApi';

const BookingsManage = () => {
    const axiosInstance = useAxios();
    const { userId } = useSelector((state) => state.auth);
    const [sessions, setSessions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [reportText, setReportText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const tabs = [
      { label: 'Profile', path: '/profile' },
      { label: 'Security', path: '/password' },
      { label: 'Bookings', path: '/bookings', active: true },
    ];

    const fetchStudentSessions = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('bookings/');
        const studentBookings = response.data.filter(
          (booking) => booking.student_id === userId
        );
  
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

    const handleReportSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        await studentApi.submitReport(axiosInstance, {
          bookingId: selectedSessionId,
          reporterId: userId,
          description: reportText
        });
        
        toast.success('Report submitted successfully');
        setIsReportModalOpen(false);
        setReportText('');
        setSelectedSessionId(null);
        fetchStudentSessions();
      } catch (error) {
        const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.response?.data?.non_field_errors || 'Failed to submit report';
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleOpenReportModal = (sessionId) => {
      setSelectedSessionId(sessionId);
      setIsReportModalOpen(true);
    };

    const handleCloseReportModal = () => {
      setIsReportModalOpen(false);
      setReportText('');
      setSelectedSessionId(null);
    };

    return (
        <div className="flex-1 bg-gradient-to-b from-blue-50 to-white">
          <main className="container mx-auto px-4 py-8">
            {/* Profile Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Bookings</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Manage your session bookings and upcoming classes
              </p>
            </div>
    
            {/* Navigation Tabs */}
            <NavigationTabs tabs={tabs} />
    
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
                    onReportSession={handleOpenReportModal}
                  />
                )}
              </div>
            </div>

            <ReportModal 
              isOpen={isReportModalOpen}
              onClose={handleCloseReportModal}
              onSubmit={handleReportSubmit}
              reportText={reportText}
              setReportText={setReportText}
              isSubmitting={isSubmitting}
            />
          </main>
        </div>
      );
}

export default BookingsManage;