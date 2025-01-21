import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Avatar from '../../../../common/ui/Avatar';
import { FaCamera, FaTrash, FaWallet } from 'react-icons/fa';
import PrimaryButton from '../buttons/PrimaryButton';

const ProfilePicture = ({ 
  profileImage, 
  name, 
  editMode = false, 
  size = 200,
  onImageChange,
  onImageDelete,
  imagePreview,
  className = ""
}) => {
  const navigate = useNavigate();
  const isTutor = useSelector((state) => state.auth.isTutor);
  const credits = useSelector((state) => state.auth.credits);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-[200px] h-[200px] rounded-full overflow-hidden bg-gray-100">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Profile Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Avatar 
                src={profileImage} 
                name={name} 
                size={size}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {editMode && !isTutor && (
            <div className="absolute bottom-2 right-2 flex gap-2">
              <label className="cursor-pointer bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-md">
                <FaCamera className="w-4 h-4" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onImageChange}
                />
              </label>
              {(profileImage || imagePreview) && (
                <button
                  onClick={onImageDelete}
                  className="bg-red-600 text-white p-2.5 rounded-full hover:bg-red-700 transition-colors shadow-md"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
        {editMode && !isTutor && (
          <p className="text-sm text-gray-600 text-center">
            Upload a professional profile picture (max 5MB)
          </p>
        )}
        {editMode && isTutor && (
          <p className="text-sm text-gray-600 text-center">
            To maintain the professionalism of the platform, we recommend upload the image when request for language change.
          </p>
        )}
        
        {/* Credits and Withdraw Button for Students */}
        {!isTutor && (
          <div className="w-full mt-4 space-y-3">
            <PrimaryButton
              onClick={() => navigate('/withdraw')}
            >
              Withdraw Credits
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePicture;