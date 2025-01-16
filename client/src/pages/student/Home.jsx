import React, { useEffect, useState } from 'react';
import Navbar from '../../components/user/Navbar';
import Footer from '../../components/user/Footer';
import useAxios from '../../hooks/useAxios';
import TutorCard from '../../components/user/TutorCard';
import { Search, GraduationCap, MessageCircle } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Home = () => {
  const axiosInstance = useAxios();
  const [tutors, setTutors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeachLanguage, setSelectedTeachLanguage] = useState('');
  const [selectedSpokenLanguage, setSelectedSpokenLanguage] = useState('');

  async function fetchTutorData() {
    try {
      setLoading(true);
      const response = await axiosInstance.get('users/');
      const tutorUsers = response.data.filter(
        user => user.user_type === "tutor" && user.is_active
      );
      setTutors(tutorUsers);
    } catch (error) {
      console.error("Error fetching tutor data:", error);
      setError("Failed to load tutors. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTutorData();
  }, []);

  // Get unique languages for both teaching and spoken languages
  const teachingLanguages = Array.from(new Set(
    tutors?.flatMap(tutor => 
      tutor?.tutor_language_to_teach?.map(lang => lang.language) || []
    )
  )).sort();

  const spokenLanguages = Array.from(new Set(
    tutors?.flatMap(tutor => 
      tutor?.language_spoken?.map(lang => lang.language) || []
    )
  )).sort();

  // Filter tutors based on search term and selected languages
  const filteredTutors = tutors?.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.country?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTeachLanguage = !selectedTeachLanguage || 
                                tutor.tutor_language_to_teach?.some(lang => 
                                  lang.language.toLowerCase() === selectedTeachLanguage.toLowerCase()
                                );
    
    const matchesSpokenLanguage = !selectedSpokenLanguage || 
                                 tutor.language_spoken?.some(lang => 
                                   lang.language.toLowerCase() === selectedSpokenLanguage.toLowerCase()
                                 );
    
    return matchesSearch && matchesTeachLanguage && matchesSpokenLanguage;
  }) || []; 

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow mt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Find Your Perfect Language Tutor
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 mb-8">
                Connect with expert language tutors for personalized 1-on-1 lessons
              </p>
              
              {/* Search and Filter Section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by name or country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 
                      bg-white/90 backdrop-blur-sm
                      text-gray-900 placeholder-gray-500
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                      transition-colors shadow-sm"
                  />
                </div>
                
                {/* Language Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Teaching Language Filter */}
                  <div className="flex-1 relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <select
                      value={selectedTeachLanguage}
                      onChange={(e) => setSelectedTeachLanguage(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 
                        bg-white/90 backdrop-blur-sm
                        text-gray-900 
                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                        transition-colors shadow-sm
                        appearance-none cursor-pointer"
                    >
                      <option value="" className="text-gray-900">All Teaching Languages</option>
                      {teachingLanguages?.map(language => (
                        <option key={language} value={language} className="text-gray-900">
                          {language}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Spoken Language Filter */}
                  <div className="flex-1 relative">
                    <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <select
                      value={selectedSpokenLanguage}
                      onChange={(e) => setSelectedSpokenLanguage(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 
                        bg-white/90 backdrop-blur-sm
                        text-gray-900
                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                        transition-colors shadow-sm
                        appearance-none cursor-pointer"
                    >
                      <option value="" className="text-gray-900">All Spoken Languages</option>
                      {spokenLanguages?.map(language => (
                        <option key={language} value={language} className="text-gray-900">
                          {language}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tutors Grid Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Results Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {!loading ? `${filteredTutors.length} Tutors Available` : ''}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                {selectedTeachLanguage && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                    <span>Teaches: {selectedTeachLanguage}</span>
                  </div>
                )}
                {selectedSpokenLanguage && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <span>Speaks: {selectedSpokenLanguage}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Loading, Error, and Empty States */}
            {loading ? (
              <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                  <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
                    <LoadingSpinner size="lg" className="text-blue-600" />
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                  <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center">
                    <p className="font-medium">{error}</p>
                  </div>
                </div>
              </div>
            ) : filteredTutors.length === 0 ? (
              <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tutors found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search or filters to find more tutors
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                  {/* Tutors Grid */}
                  <div className="grid gap-6 max-h-[600px] overflow-y-auto pr-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">                  {filteredTutors.map((tutor) => (
                      <TutorCard
                        key={tutor.id}
                        name={tutor.name}
                        profileImage={tutor.profile_image}
                        tutorDetails={tutor.tutor_details}
                        languageSpoken={tutor.language_spoken}
                        languageToTeach={tutor.tutor_language_to_teach}
                        country={tutor.country}
                        tutor_id={tutor.id}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;