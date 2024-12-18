import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';
import SessionCreationModal from '../components/SessionCreationModal';
import useAxios from '../hooks/useAxios';
import { useSelector } from 'react-redux';
import SessionsList from '../components/SessionList';
import Navbar from '../components/Navbar';

const TutorSessionsPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosInstance = useAxios();
  const { userId, required_credits } = useSelector((state) => state.auth);
  const [sessions, setSessions] = useState([]);
  const [teachingLanguage, setTeachingLanguage] = useState(null);

  const handleAddSession = () => {
    setIsModalOpen(true);
  };

  const fetchTutorAvailability = async () => {
    try {
      const response = await axiosInstance.get('tutor-availabilities/');
      const tutorAvailabilities = response.data.filter(slot => slot.tutor_id === userId);
      setSessions(tutorAvailabilities);
      console.log(tutorAvailabilities);
    } catch (error) {
      console.error('Error fetching session availability:', error);
    }
  };

  useEffect(() => {
    fetchTutorAvailability();
    setTeachingLanguage(sessionStorage.getItem('teachingLanguage'));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Teaching Sessions</h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Manage your teaching schedule and session availability
          </p>
        </div>

        {/* Navigation Tabs */}
        <nav className="max-w-4xl mx-auto mb-8 flex space-x-1 rounded-xl bg-blue-50 p-1">
          {[
            { label: 'Profile', path: '/tutor-dashboard' },
            { label: 'Security', path: '/tutor-password-change' },
            { label: 'Sessions', path: '/tutor-sessions', active: true },
            { label: 'Payments', path: '/payments' }
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`flex-1 whitespace-nowrap py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200
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
            {/* Action Buttons Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              {/* Add Session Button */}
              <button 
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                onClick={handleAddSession}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                Add New Session
              </button>
            </div>

            {/* Sessions List */}
            <SessionsList 
              sessions={sessions} 
              onAddSession={handleAddSession} 
              fetchTutorAvailability={fetchTutorAvailability}
            />

            {/* Session Creation Modal */}
            <SessionCreationModal 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              tutorCredits={required_credits}
              fetchTutorAvailability={fetchTutorAvailability}
              teachingLanguage={teachingLanguage}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TutorSessionsPage;