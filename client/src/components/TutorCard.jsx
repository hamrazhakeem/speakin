import React, { useState } from 'react';
import { Star, Globe, IdCard, GraduationCap, CreditCard, MessageCircle } from 'lucide-react';
import Avatar from '../components/Avatar';
import AvailabilityModal from './AvailabilityModal';
import { useNavigate } from 'react-router-dom';

const TutorCard = ({ name, profileImage, tutorDetails, languageSpoken, languageToTeach, country, tutor_id }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const rating = tutorDetails?.rating || 4.0;
  const totalReviews = tutorDetails?.total_reviews || 0;
  const speakinName = tutorDetails?.speakin_name;

  const spokenLanguages = languageSpoken
    ?.map(lang => `${lang.language} (${lang.proficiency})`)
    .join(', ') || 'No language information';

  const handleVideoClick = () => {
    setIsVideoPlaying(true);
    if (tutorDetails?.intro_video) {
      const videoElement = document.createElement('video');
      videoElement.src = tutorDetails.intro_video;
      videoElement.controls = true;
      videoElement.classList.add('fixed', 'top-0', 'left-0', 'w-screen', 'h-screen', 'z-50');
      document.body.appendChild(videoElement);
      videoElement.requestFullscreen();

      videoElement.addEventListener('ended', () => {
        document.body.removeChild(videoElement);
        setIsVideoPlaying(false);
      });
    }
  };

  const getTeachingVerification = (teachLang) => ({
    text: teachLang.is_native ? 'Native Tutor' : 'Certified Tutor',
    icon: teachLang.is_native ? 
      <IdCard className="w-4 h-4 text-green-600" /> : 
      <GraduationCap className="w-4 h-4 text-blue-600" />,
    bgColor: teachLang.is_native ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
  });

  const handleCheckAvailability = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleNavigate = () => {
    console.log('tutoridddd', tutor_id)
    navigate('/messages', { state: { tutor_id: tutor_id } });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Main Card Content */}
      <div className="p-4">
        {/* Top Section: Avatar, Name, Rating, and Price */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* Left Side: Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <Avatar src={profileImage} name={speakinName || name} size={64} />
            <div>
              <h3 className="text-lg font-semibold">{speakinName}</h3>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-sm text-gray-500">({totalReviews})</span>
              </div>
            </div>
          </div>

          {/* Right Side: Price and Action Buttons */}
          <div className="flex flex-col items-end space-y-2">
            {/* Price Display */}
            <div className="flex items-center space-x-1">
              <span className="font-bold text-lg">{tutorDetails?.required_credits || 0}</span>
              <CreditCard className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600">/hour</span>
            </div>

            {/* Action Buttons Container */}
            <div className="flex flex-col sm:flex-row gap-2 w-full justify-end">
              <button 
                onClick={handleCheckAvailability} 
                className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Book</span>
              </button>
              <button
                className="w-full sm:w-auto bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                onClick={handleNavigate}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                <span>Message</span>
              </button>
            </div>
            {showModal && <AvailabilityModal tutorId={tutor_id} onClose={handleCloseModal} />}
          </div>
        </div>

        {/* Teaching Languages Section */}
        <div className="mt-4 space-y-2">
          {languageToTeach?.map((teachLang, index) => {
            const verification = getTeachingVerification(teachLang);
            return (
              <div key={index} className="flex flex-wrap items-center gap-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">{teachLang.language}</span>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full ${verification.bgColor}`}>
                  {verification.icon}
                  <span className="text-xs">{verification.text}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Location and Languages */}
        <div className="mt-3 text-sm text-gray-500">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-medium">📍 {country || 'Location not specified'}</span>
            <span className="hidden sm:inline">•</span>
            <span className="w-full sm:w-auto">Speaks {spokenLanguages}</span>
          </div>
        </div>

        {/* Expandable Description */}
        <div className="mt-3">
          <p className={`text-sm text-gray-700 ${!isExpanded && 'line-clamp-2'}`}>
            {tutorDetails?.about || 'No description available'}
          </p>
          {tutorDetails?.about && tutorDetails.about.length > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 text-sm mt-1 hover:underline"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>

      {/* Video Preview Section */}
      {tutorDetails?.intro_video && !isVideoPlaying && (
        <div
          className="w-full h-32 sm:h-48 bg-gray-100 cursor-pointer group relative"
          onClick={handleVideoClick}
        >
          <svg 
            className="w-full h-full" 
            viewBox="0 0 1280 720" 
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background with gradient */}
            <defs>
              <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="1" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="1" />
              </linearGradient>
              {/* Overlay gradient */}
              <linearGradient id="overlayGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
              </linearGradient>
              {/* Circle pattern */}
              <pattern id="circlePattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.2)"/>
              </pattern>
            </defs>

            {/* Main background */}
            <rect width="1280" height="720" fill="url(#backgroundGradient)"/>
            
            {/* Decorative pattern */}
            <rect width="1280" height="720" fill="url(#circlePattern)"/>

            {/* Abstract shapes */}
            <circle cx="1100" cy="160" r="280" fill="rgba(255,255,255,0.1)"/>
            <circle cx="180" cy="600" r="200" fill="rgba(255,255,255,0.1)"/>

            {/* Main content area */}
            <g transform="translate(640,360)">
              {/* Chat bubbles suggesting conversation */}
              <g transform="translate(-200,-50)">
                {/* Left bubble */}
                <rect x="-120" y="-30" width="200" height="60" rx="30" fill="rgba(255,255,255,0.9)"/>
                <text x="-30" y="10" fontFamily="Arial" fontSize="24" fill="#4F46E5" textAnchor="middle">
                  Hello!
                </text>
              </g>
              <g transform="translate(200,50)">
                {/* Right bubble */}
                <rect x="-80" y="-30" width="200" height="60" rx="30" fill="rgba(255,255,255,0.9)"/>
                <text x="20" y="10" fontFamily="Arial" fontSize="24" fill="#4F46E5" textAnchor="middle">
                  ¡Hola!
                </text>
              </g>
            </g>

            {/* Play button */}
            <g transform="translate(640,360)">
              <circle r="50" fill="white"/>
              <path d="M-15,-25 L35,0 L-15,25 Z" fill="#4F46E5"/>
            </g>

            {/* Bottom overlay */}
            <rect width="1280" height="200" y="520" fill="url(#overlayGradient)"/>

            {/* Text overlay */}
            <text x="50" y="660" fontFamily="Arial" fontSize="32" fill="white" fontWeight="bold">
              Meet Your Tutor
            </text>
            <text x="50" y="695" fontFamily="Arial" fontSize="24" fill="rgba(255,255,255,0.8)">
              Watch introduction video
            </text>
          </svg>
        </div>
      )}
    </div>
  );
};

export default TutorCard;