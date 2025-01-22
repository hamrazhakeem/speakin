import React, { useState, useEffect } from 'react';
import useAxios from '../../../hooks/useAxios';
import LoadingSpinner from '../../common/ui/LoadingSpinner';
import LanguageSection from './LanguageSection';
import { adminApi } from '../../../api/adminApi';

const LanguagesManagement = () => {
  const [languages, setLanguages] = useState([]);
  const [proficiencies, setProficiencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminApi.getPlatformLanguages(axiosInstance);
        if (response) {
          setLanguages(response.languages || []);
          setProficiencies(response.proficiencies || []);
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
          <LanguageSection
            title="Available Languages"
            subtitle="Languages currently supported on the platform"
            items={languages}
            type="language"
          />
          <LanguageSection
            title="Proficiency Levels"
            subtitle="Available language proficiency levels"
            items={proficiencies}
            type="proficiency"
          />
        </div>
      )}
    </div>
  );
};

export default LanguagesManagement;
