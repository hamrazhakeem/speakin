import React, { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import useAxios from '../hooks/useAxios';

const TopStudentsCard = ({ bookings }) => {
  const [loading, setLoading] = useState(true);
  const [topStudents, setTopStudents] = useState([]);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchAndProcessStudents = async () => {
      try {
        const studentCounts = bookings.reduce((acc, booking) => {
          if (booking.booking_status === 'completed') {
            acc[booking.student_id] = (acc[booking.student_id] || 0) + 1;
          }
          return acc;
        }, {});

        const studentIds = Object.keys(studentCounts);
        
        const studentDetails = await Promise.all(
          studentIds.map(async (id) => {
              const response = await axiosInstance.get(`users/${id}/`);
              return {
                studentId: parseInt(id),
                sessionCount: studentCounts[id],
              name: response.data.name,
              learningLanguages: response.data.language_to_learn.map(
                  (lang) => lang.language
              )
              };
          })
        );

        const topFive = studentDetails
          .sort((a, b) => b.sessionCount - a.sessionCount)
          .slice(0, 5);

        setTopStudents(topFive);
        setLoading(false);
      } catch (error) {
        console.error('Error processing student data:', error);
        setLoading(false);
      }
    };

    if (bookings.length > 0) {
    fetchAndProcessStudents();
    }
  }, [bookings]);

  if (loading) {
    return (
      <div className="w-full bg-zinc-800 rounded-lg">
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-800 rounded-lg border border-zinc-700">
      <div className="flex flex-row items-center justify-between p-4">
        <h3 className="text-lg font-semibold text-white">Top Performing Students</h3>
        <Award className="w-5 h-5 text-yellow-500" />
      </div>
      <div className="p-4 space-y-4">
        {topStudents.map((student, index) => (
          <div
            key={student.studentId}
            className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">#{index + 1}</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">{student.name}</h4>
                <p className="text-xs text-zinc-400">
                  {student.learningLanguages.join(', ')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">{student.sessionCount}</p>
              <p className="text-xs text-zinc-400">Completed Sessions</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopStudentsCard;