import React, { useState, useEffect } from 'react';
import useAxios from '../../../hooks/useAxios';
import LoadingSpinner from '../../common/LoadingSpinner';

const LanguagesManagement = () => {
  const [languages, setLanguages] = useState([]);
  const [proficiencies, setProficiencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('platform-languages/');
        if (response.data) {
          setLanguages(response.data.languages || []);
          setProficiencies(response.data.proficiencies || []);
        }
        console.log(response);
      } catch (error) {
        console.error('Error fetching languages:', error);
        setLanguages([]);
        setProficiencies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Platform Languages</h1>
        <p className="text-sm text-zinc-400">Manage languages and proficiency levels available on the platform</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" className="text-white" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Languages Section */}
          <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800/50 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-zinc-800/50">
              <h3 className="text-lg font-medium text-white">Available Languages</h3>
              <p className="text-sm text-zinc-400 mt-1">Languages currently supported on the platform</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {languages && languages.map((language) => (
                  <div
                    key={language.id}
                    className="flex items-center justify-between p-4 bg-black/50 backdrop-blur rounded-lg border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
                  >
                    <span className="text-white">{language.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Proficiencies Section */}
          <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800/50 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-zinc-800/50">
              <h3 className="text-lg font-medium text-white">Proficiency Levels</h3>
              <p className="text-sm text-zinc-400 mt-1">Available language proficiency levels</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {proficiencies && proficiencies.map((proficiency) => (
                  <div
                    key={proficiency.level}
                    className="flex items-center justify-between p-4 bg-black/50 backdrop-blur rounded-lg border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
                  >
                    <div>
                      <span className="text-white font-medium">{proficiency.level}</span>
                      <p className="text-sm text-zinc-400 mt-1">{proficiency.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguagesManagement;
