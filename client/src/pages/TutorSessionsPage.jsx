import React, { useState } from 'react';
import { Calendar, Clock, Users, Plus, Filter, ChevronRight } from 'lucide-react';
import TutorNavbar from "../components/TutorNavbar";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';
import SessionCreationModal from '../components/SessionCreationModal';
import { useEffect } from 'react';
import useAxios from '../hooks/useAxios';
import { useSelector } from 'react-redux';
import SessionsList from '../components/SessionList';

const TutorSessionsPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosInstance = useAxios();
  const { userId, required_credits } = useSelector((state) => state.auth);
  const [sessions, setSessions] = useState([]);
  const [tutorId, setTutorId] = useState(null); // State to store tutor_id

  const handleAddSession = () => {
    setIsModalOpen(true);
  };

  // Fetch tutor_id from the user service
  const fetchTutorId = async () => {
    try {
      const response = await axiosInstance.get(`users/${userId}/tutor-details/`);
      setTutorId(response.data.id); // Store tutor_id in the state
    } catch (error) {
      console.error('Error fetching tutor details:', error);
    }
  };

  // Fetch tutor availability only if tutorId is available
  const fetchTutorAvailability = async () => {
    if (!tutorId) return; // Make sure tutorId is available before fetching data
    try {
      const response = await axiosInstance.get('get-tutor-availabilities/');
      const tutorAvailabilities = response.data.filter(slot => slot.tutor_id === tutorId);
      setSessions(tutorAvailabilities);
    } catch (error) {
      console.error('Error fetching session availability:', error);
    }
  };

  useEffect(() => {
    fetchTutorId(); // Fetch tutorId once when component mounts
  }, [userId]); // Dependency on userId to refetch when it changes

  useEffect(() => {
    if (tutorId) {
      fetchTutorAvailability(); // Fetch tutor availability once tutorId is set
    }
  }, [tutorId]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <TutorNavbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800">Teaching Sessions</h1>
              <button 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    onClick={handleAddSession}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Session
                </button>
                
                <SessionCreationModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    tutorCredits={required_credits} // Pass the tutor's credit requirement here
                    fetchTutorAvailability={fetchTutorAvailability} // Pass the fetch function here
                />
            </div>

            <nav className="flex space-x-6 mb-8 border-b pb-4">
              <button className="text-gray-600 text-lg hover:text-blue-600 transition-colors" onClick={()=>navigate('/tutor-dashboard')}>Profile</button>
              <button className="text-gray-600 text-lg hover:text-blue-600 transition-colors" onClick={()=>navigate('/tutor-password-change')}>Security</button>
              <button className="text-blue-600 font-semibold text-lg hover:text-blue-800 transition-colors">Sessions</button>
              <button className="text-gray-600 text-lg hover:text-blue-600 transition-colors">Payments</button>
            </nav>

            <div className="mb-6 flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
                <select className="px-4 py-2 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Sessions</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              
            <SessionsList 
              sessions={sessions} 
              onAddSession={handleAddSession} 
              fetchTutorAvailability={fetchTutorAvailability}
            />              
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TutorSessionsPage;