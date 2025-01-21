import React from 'react';

const LanguageCard = ({ language, icon, learners, percentage, color }) => {
  return (
    <div className={`${color} rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}>
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{language}</h3>
      <p className="text-sm text-gray-600 mb-1">{learners}</p>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
        <div 
          className="bg-blue-600 h-1.5 rounded-full" 
          style={{ width: percentage }}
        ></div>
      </div>
      <p className="text-xs text-gray-500">{percentage} of students</p>
    </div>
  );
};

export default LanguageCard;