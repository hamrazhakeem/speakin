import React from 'react';

const LanguageList = ({ languages, getProficiencyColor }) => {
  return (
    <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
      {languages && languages.length > 0 ? (
        languages.map((lang, index) => (
          <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
            <span className="font-medium text-gray-800">
              {typeof lang.language === 'object' ? lang.language.name : lang.language}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProficiencyColor(
              typeof lang.proficiency === 'object' ? lang.proficiency.level : lang.proficiency
            )}`}>
              {typeof lang.proficiency === 'object' ? lang.proficiency.description : lang.proficiency}
            </span>
          </div>
        ))
      ) : (
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-600">No languages specified</p>
        </div>
      )}
    </div>
  );
};

export default LanguageList;