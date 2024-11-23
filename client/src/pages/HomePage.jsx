import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useAxios from '../hooks/useAxios';
import TutorCard from '../components/TutorCard';

const HomePage = () => {
  const axiosInstance = useAxios();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchTutorData() {
    try {
      setLoading(true);
      const response = await axiosInstance.get('users/');
      const tutorUsers = response.data.filter(
        user => user.user_type === "tutor" && user.is_active
      );
      console.log('responseeeeeeeeeeeeeeeeee',tutorUsers)
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow mt-14 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Find Your Perfect Language Tutor
          </h1>
          
          {loading ? (
            <div className="text-center py-8">
              <p>Loading tutors...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
            </div>
          ) : tutors.length === 0 ? (
            <div className="text-center py-8">
              <p>No tutors available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {tutors.map((tutor) => (
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
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;