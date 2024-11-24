import React from 'react';
import { Calendar, Plus, RotateCw } from 'lucide-react';

const EmptyState = ({ 
  handleRefresh,
  isRefreshing,  // State variable to track if the refresh button is being clicked
  onAddSession, 
  title, 
  description, 
  showButton = true,
  buttonText,
  buttonIcon: ButtonIcon = Plus,
  bgColor = 'bg-blue-50',
  iconColor = 'text-blue-600',
  buttonColor = 'bg-blue-600 hover:bg-blue-700'
}) => (
  <div className="text-center py-16 px-4">
          <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isRefreshing}
        >
          <RotateCw
            className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`}
          />
        </button>
      </div>
    <div className={`${bgColor} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
      <Calendar className={`w-8 h-8 ${iconColor}`} />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      {title || "No Sessions Found"}
    </h3>
    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
      {description || "There are no sessions to display at this time."}
    </p>

    {showButton && onAddSession && (
      <button 
        className={`${buttonColor} text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center`}
        onClick={onAddSession}
      >
        <ButtonIcon className="w-4 h-4 mr-2" />
        {buttonText || "Add Session"}
      </button>
    )}
  </div>
);

export default EmptyState;