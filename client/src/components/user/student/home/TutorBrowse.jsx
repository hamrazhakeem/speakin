import { GraduationCap, MessageCircle, Search } from "lucide-react";
import TutorCard from "./TutorCard";
import LoadingSpinner from "../../../common/ui/LoadingSpinner";
import useAxios from "../../../../hooks/useAxios";
import { useEffect, useState } from "react";
import HomeEmptyState from "./HomeEmptyState";
import FilterSelect from "./FilterSelect";
import { studentApi } from "../../../../api/studentApi";
import { useSelector } from 'react-redux';

const TutorBrowse = () => {
    const axiosInstance = useAxios();
    const [tutors, setTutors] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeachLanguage, setSelectedTeachLanguage] = useState('');
    const [selectedSpokenLanguage, setSelectedSpokenLanguage] = useState('');
    const [studentLanguages, setStudentLanguages] = useState(null);
    const userId = useSelector((state) => state.auth.userId);
  
    async function fetchData() {
      try {
        setLoading(true);
        const [tutorsResponse, studentResponse] = await Promise.all([
          studentApi.getUsers(axiosInstance),
          studentApi.getUser(axiosInstance, userId)
        ]);

        const tutorUsers = tutorsResponse.filter(
          user => user.user_type === "tutor" && user.is_active
        );
        setTutors(tutorUsers);
        setStudentLanguages(studentResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  
    useEffect(() => {
      fetchData();
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
      
      // Additional filter to only show tutors that match student's learning preferences
      const matchesStudentPreferences = 
        tutor.tutor_language_to_teach?.some(tutorLang =>
          studentLanguages?.language_to_learn?.some(
            studentLang => studentLang.language === tutorLang.language
          )
        );
      
      return matchesSearch && matchesTeachLanguage && matchesSpokenLanguage && matchesStudentPreferences;
    }) || [];
  
    return (
      <>
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
                  <FilterSelect
                    icon={<GraduationCap className="h-5 w-5" />}
                    value={selectedTeachLanguage}
                    onChange={(e) => setSelectedTeachLanguage(e.target.value)}
                    options={teachingLanguages}
                    placeholder="All Teaching Languages"
                    userLanguageMessage="(You want to learn this)"
                    renderOption={(lang) => ({
                      value: lang,
                      label: lang,
                      isUserLanguage: studentLanguages?.language_to_learn?.some(
                        userLang => userLang.language === lang
                      )
                    })}
                  />
                  
                  <FilterSelect
                    icon={<MessageCircle className="h-5 w-5" />}
                    value={selectedSpokenLanguage}
                    onChange={(e) => setSelectedSpokenLanguage(e.target.value)}
                    options={spokenLanguages}
                    placeholder="All Spoken Languages"
                    userLanguageMessage="(You speak this)"
                    renderOption={(lang) => ({
                      value: lang,
                      label: lang,
                      isUserLanguage: studentLanguages?.language_spoken?.some(
                        userLang => userLang.language === lang
                      )
                    })}
                  />
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
              <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
                <LoadingSpinner size="lg" className="text-blue-600" />
              </div>
            ) : error ? (
              <HomeEmptyState
                icon="error"
                title="Error Loading Tutors"
                description={error}
                className="bg-red-50"
              />
            ) : filteredTutors.length === 0 ? (
              <HomeEmptyState
                icon="search"
                title="No tutors found"
                description="Try adjusting your search or filters to find more tutors"
              />
            ) : (
              <div className="grid gap-6 max-h-[600px] scrollbar-thin overflow-y-auto pr-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                {filteredTutors.map((tutor) => (
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
            )}
          </div>
        </div>
      </>
    );
  };
  
  export default TutorBrowse;