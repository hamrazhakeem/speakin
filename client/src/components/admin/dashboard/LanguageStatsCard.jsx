import React, { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';
import useAxios from '../../../hooks/useAxios';
import LoadingSpinner from '../../common/ui/LoadingSpinner';

const LanguageStatsCard = () => {
  const [languageStats, setLanguageStats] = useState({ teaching: [], learning: [], spoken: [] });
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, availabilitiesRes] = await Promise.all([
          axiosInstance.get('bookings/'),
          axiosInstance.get('tutor-availabilities/'),
        ]);

        // Mapping teaching languages
        const teachingLanguages = {};
        bookingsRes.data.forEach(booking => {
          const availability = availabilitiesRes.data.find(a => a.id === booking.availability);
          if (availability) {
            const lang = availability.language_to_teach;
            teachingLanguages[lang] = (teachingLanguages[lang] || 0) + 1;
          }
        });

        const teachingData = Object.entries(teachingLanguages)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        // Fetching users for learning and spoken languages
        const usersRes = await axiosInstance.get('users/');
        console.log('userres',usersRes)
        const spokenLanguages = {}; // This will store the count of users for each spoken language
        const learningLanguages = {}; // This stores the count for learning languages

        usersRes.data.forEach(user => {
          // For each user, track the spoken languages
          user.language_spoken?.forEach(langObj => {
            if (spokenLanguages[langObj.language]) {
              spokenLanguages[langObj.language].add(user.id); // Using Set to ensure unique users
            } else {
              spokenLanguages[langObj.language] = new Set([user.id]);
            }
          });

          // Track the languages that users are learning (if any)
          user.language_to_learn?.forEach(langObj => {
            if (learningLanguages[langObj.language]) {
              learningLanguages[langObj.language].add(user.id);
            } else {
              learningLanguages[langObj.language] = new Set([user.id]);
            }
          });
        });

        const spokenData = Object.entries(spokenLanguages)
          .map(([name, users]) => ({ name, value: users.size })) // Count the number of unique users
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        const learningData = Object.entries(learningLanguages)
          .map(([name, users]) => ({ name, value: users.size }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        setLanguageStats({
          teaching: teachingData,
          learning: learningData,
          spoken: spokenData,
        });
      } catch (error) {
        console.error('Error fetching language stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-zinc-800 rounded-lg">
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const renderLanguageList = (languages, title, iconColor) => (
    <div className="w-full bg-zinc-800 rounded-lg border border-zinc-700">
      <div className="flex flex-row items-center justify-between p-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <Languages className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="p-4 space-y-4">
        {languages.map((lang, index) => (
          <div
            key={lang.name}
            className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">#{index + 1}</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">{lang.name}</h4>
                <p className="text-xs text-zinc-400">Language</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">{lang.value}</p>
              <p className="text-xs text-zinc-400">Users</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {renderLanguageList(languageStats.spoken, "Top Languages Spoken", "text-blue-500")}
      {renderLanguageList(languageStats.learning, "Top Languages Being Learned", "text-purple-500")}
      {renderLanguageList(languageStats.teaching, "Top Languages Being Taught", "text-green-500")}
    </div>
  );
};

export default LanguageStatsCard;
