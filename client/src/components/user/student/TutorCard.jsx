import React, { useState } from 'react';
import { Star, Globe, IdCard, GraduationCap, CreditCard, MessageCircle } from 'lucide-react';
import Avatar from '../../common/Avatar';
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
      const container = document.createElement('div');
      container.classList.add('fixed', 'top-0', 'left-0', 'w-screen', 'h-screen', 'z-50', 'bg-black', 'flex', 'flex-col');
      
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '✕';
      closeButton.classList.add(
        'absolute', 'top-4', 'right-4', 'text-white', 'text-2xl', 
        'w-10', 'h-10', 'flex', 'items-center', 'justify-center',
        'bg-gray-800', 'rounded-full', 'hover:bg-gray-700',
        'transition-colors', 'z-50'
      );

      const videoElement = document.createElement('video');
      videoElement.src = tutorDetails.intro_video;
      videoElement.controls = true;
      videoElement.classList.add('w-full', 'h-full', 'object-contain');

      const cleanup = () => {
        document.body.removeChild(container);
        setIsVideoPlaying(false);
        document.exitFullscreen().catch(() => {});
      };

      closeButton.onclick = cleanup;
      videoElement.addEventListener('ended', cleanup);

      container.appendChild(closeButton);
      container.appendChild(videoElement);
      document.body.appendChild(container);
      
      videoElement.requestFullscreen().catch(() => {});
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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6 flex flex-col gap-4">
        {/* Priority 1: Core Info */}
        <div className="flex items-start gap-4">
          <Avatar src={profileImage} name={speakinName || name} size={56} />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{speakinName}</h3>
            
            {/* Improved Rating Design */}
            <div className="flex items-center mt-2 space-x-2">
              <div className="flex items-center px-2.5 py-1 bg-yellow-50 rounded-full">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 text-sm font-medium text-yellow-700">{rating}</span>
              </div>
              <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
            </div>

            {/* Credits Section */}
            <div className="mt-2 flex items-center text-lg font-bold text-gray-900">
              <CreditCard className="w-5 h-5 text-blue-600 mr-1" />
              {tutorDetails?.required_credits || 0}
              <span className="text-sm text-gray-600 ml-1">/hour</span>
            </div>
          </div>
                    {/* Right side: Action buttons for larger screens */}
          <div className="hidden sm:flex flex-col gap-2 min-w-[120px]">
            <button 
              onClick={handleCheckAvailability}
              className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book Session
            </button>
            <button
              onClick={handleNavigate}
              className="w-full px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Message
            </button>
          </div>
        </div>

        

        {/* Priority 2: Country - Improved Design */}
        <div className="flex items-center">
          <div className="inline-flex items-center px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-600">
            <Globe className="w-4 h-4 text-gray-500 mr-1.5" />
            <span className="font-medium">{country || 'Location not specified'}</span>
          </div>
        </div>

        {/* Priority 3: Teaching Languages */}
        <div className="flex flex-wrap gap-2">
          {languageToTeach?.map((teachLang, index) => {
            const verification = getTeachingVerification(teachLang);
            return (
              <div key={index} className="inline-flex items-center">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-l-full text-sm">
                  {teachLang.language}
                </span>
                <span className={`px-3 py-1 rounded-r-full text-sm flex items-center ${verification.bgColor}`}>
                  {verification.icon}
                  <span className="ml-1">{verification.text}</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Priority 4: Languages Spoken */}
        <div className="text-sm text-gray-600">
          <div>
            <span className="font-medium">Speaks:</span> {spokenLanguages}
          </div>
        </div>

        {/* Priority 5: About/Description */}
        <div className={`text-sm text-gray-700 ${!isExpanded && 'line-clamp-2'}`}>
          {tutorDetails?.about || 'No description available'}
          {tutorDetails?.about && tutorDetails.about.length > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 text-sm mt-1 hover:underline"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Priority 6: Video Preview */}
        {tutorDetails?.intro_video && !isVideoPlaying && (
          <button onClick={handleVideoClick} className="w-full">
            <div className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Watch Introduction Video</div>
                <div className="text-sm text-gray-500">Learn more about your tutor</div>
              </div>
            </div>
          </button>
        )}

        {/* Mobile-only action buttons at bottom */}
        <div className="flex flex-col gap-2 mt-2 sm:hidden">
          <button 
            onClick={handleCheckAvailability}
            className="w-full px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book 
          </button>
          <button
            onClick={handleNavigate}
            className="w-full px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Message
          </button>
        </div>
      </div>
      {showModal && <AvailabilityModal tutorId={tutor_id} onClose={handleCloseModal} />}
    </div>
  );
};

export default TutorCard;