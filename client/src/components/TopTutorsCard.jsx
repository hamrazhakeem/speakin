import React, { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import useAxios from '../hooks/useAxios';

const TopTutorsCard = ({ bookings, availabilities }) => {
  const [tutorDetails, setTutorDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        const availabilitiesArray = Object.values(availabilities);
        const tutorIds = [...new Set(availabilitiesArray.map(avail => avail.tutor_id))];

        for (const tutorId of tutorIds) {
          const response = await axiosInstance.get(`users/${tutorId}/`);
          setTutorDetails(prevDetails => ({
            ...prevDetails,
            [tutorId]: {
                        speakin_name: response.data.tutor_details.speakin_name,
                        teaching_language: response.data.tutor_language_to_teach.map(lang => lang.language),
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching tutor details:', error);
      } finally {
        setLoading(false);
      }
    };

  
    // Ensure availabilities is not empty before calling the function
    if (Object.keys(availabilities).length > 0) {
      fetchTutorDetails();
    }
  }, [availabilities]);
  

  const getTopTutors = () => {
    const tutorSessionCounts = {};

    bookings.forEach(booking => {
        if (booking.booking_status === 'completed') {
        const availability = availabilities[booking.availability];
            if (availability && availability.session_type === 'standard') {
          const tutorId = availability.tutor_id;
          tutorSessionCounts[tutorId] = (tutorSessionCounts[tutorId] || 0) + 1;
        }
      }
    });

    const sortedTutors = Object.entries(tutorSessionCounts)
      .map(([tutorId, sessionCount]) => ({
        tutorId: parseInt(tutorId),
        sessionCount,
        ...tutorDetails[tutorId],
      }))
      .sort((a, b) => b.sessionCount - a.sessionCount)
      .slice(0, 5);

    return sortedTutors;
  };

  

  if (loading) {
    return (
      <div className="w-full bg-zinc-800 rounded-lg">
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const topTutors = getTopTutors();

  return (
    <div className="w-full bg-zinc-800 rounded-lg border border-zinc-700">
      <div className="flex flex-row items-center justify-between p-4">
        <h3 className="text-lg font-semibold text-white">Top Performing Tutors</h3>
        <Award className="w-5 h-5 text-yellow-500" />
      </div>
      <div className="p-4 space-y-4">
        {topTutors.map((tutor, index) => (
          <div
            key={tutor.tutorId}
            className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">#{index + 1}</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">{tutor.speakin_name}</h4>
                <p className="text-xs text-zinc-400">{tutor.teaching_language}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">{tutor.sessionCount}</p>
              <p className="text-xs text-zinc-400">Completed Sessions</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopTutorsCard;
