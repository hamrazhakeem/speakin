import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEdit, FaGlobe, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useAxios from '../hooks/useAxios';
import { useSelector } from 'react-redux';
import Avatar from '../components/Avatar';
import { ChevronRight } from 'lucide-react';

const ProfilePage = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  
  const [studentData, setStudentData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [countries, setCountries] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [platformLanguages, setPlatformLanguages] = useState([]);
  const [spokenProficiencyLevels, setSpokenProficiencyLevels] = useState([]);
  const [learningProficiencyLevels, setLearningProficiencyLevels] = useState([]);
  const [spokenLanguages, setSpokenLanguages] = useState([]);
  const [languageToLearn, setLanguageToLearn] = useState(null);
  const [languageErrors, setLanguageErrors] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const userId = useSelector((state) => state.auth.userId);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  const validateLanguages = () => {
    let isValid = true;
    const newErrors = [];
    const newFormErrors = {};

    // Remove spoken languages validation
    spokenLanguages.forEach((lang, index) => {
      const errors = {};
      if (lang.language && !lang.proficiency) {
        errors.proficiency = 'Please select a proficiency level';
        isValid = false;
      }
      if (!lang.language && lang.proficiency) {
        errors.language = 'Please select a language';
        isValid = false;
      }
      newErrors[index] = errors;
    });

    // Remove required validation for language to learn
    if (languageToLearn?.language && !languageToLearn?.proficiency) {
      newFormErrors.languageToLearn = 'Please select a proficiency level';
      isValid = false;
    }
    if (!languageToLearn?.language && languageToLearn?.proficiency) {
      newFormErrors.languageToLearn = 'Please select a language';
      isValid = false;
    }

    setLanguageErrors(newErrors);
    setFormErrors(newFormErrors);
    return isValid;
  };

  async function fetchUserData() {
    try {
      const response = await axiosInstance.get(`users/${userId}/`);
      setStudentData(response.data);
      console.log(response.data)
      if (response.data.language_spoken?.length > 0) {
        setSpokenLanguages(response.data.language_spoken);
      }
      
      if (response.data.language_to_learn?.length > 0) {
        setLanguageToLearn(response.data.language_to_learn[0]);
      }
      
      setValue("name", response.data.name || "");
      setValue("balance_credits", response.data.balance_credits || "");
      setValue("email", response.data.email || "");
      setValue("country", response.data.country || "");

      // Fetch countries
      const countriesResponse = await axiosInstance.get(`countries/`);
      setCountries(countriesResponse.data);

      // Fetch available languages and proficiency levels for speaking
      const spokenLanguagesResponse = await axiosInstance.get(`spoken-languages/`);
      setAvailableLanguages(spokenLanguagesResponse.data.languages);
      setSpokenProficiencyLevels(spokenLanguagesResponse.data.proficiencies);

      // Fetch platform languages and learning proficiency levels
      const platformLanguagesResponse = await axiosInstance.get(`platform-languages/`);
      setPlatformLanguages(platformLanguagesResponse.data.languages);
      setLearningProficiencyLevels(platformLanguagesResponse.data.proficiencies);
      
      console.log('Spoken Languages:', spokenLanguagesResponse.data, 'Platform:', platformLanguagesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setDeleteImage(false);
    setLanguageErrors([]);
    setFormErrors({});
    console.log('Toggle edit mode', editMode);
  };

  const handleProfileImageChange = (e) => {
    setProfileImage(e.target.files[0]);
    setDeleteImage(false);
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    setDeleteImage(true);
  };

  const handleAddSpokenLanguage = () => {
    const hasEmptyFields = spokenLanguages.some((lang, index) => {
      const errors = {};
      if (!lang.language) errors.language = 'Please select a language';
      if (!lang.proficiency) errors.proficiency = 'Please select a proficiency level';
      
      if (Object.keys(errors).length > 0) {
        const newErrors = [...languageErrors];
        newErrors[index] = errors;
        setLanguageErrors(newErrors);
        return true;
      }
      return false;
    });

    if (hasEmptyFields) {
      return;
    }

    const defaultProficiency = spokenLanguages.length === 0 ? 'Native' : 
      (spokenProficiencyLevels.find(level => level.level !== 'Native')?.level || '');
    
    setSpokenLanguages([
      ...spokenLanguages, 
      { language: '', proficiency: defaultProficiency }
    ]);
    
    setLanguageErrors([...languageErrors, {}]);
  };

  const handleRemoveSpokenLanguage = (index) => {
    const newLanguages = spokenLanguages.filter((_, i) => i !== index);
    setSpokenLanguages(newLanguages);
    
    const newErrors = languageErrors.filter((_, i) => i !== index);
    setLanguageErrors(newErrors);
  };

  const handleSpokenLanguageChange = (index, field, value) => {
    const newLanguages = [...spokenLanguages];
    
    if (field === 'language') {
      const isLanguageSelected = spokenLanguages.some(
        (lang, i) => i !== index && lang.language === value
      );
      if (isLanguageSelected) return;
      
      if (index === 0) {
        newLanguages[index] = { language: value, proficiency: 'Native' };
      } else {
        newLanguages[index] = { ...newLanguages[index], language: value };
      }
    } else {
      newLanguages[index] = { ...newLanguages[index], [field]: value };
    }
    
    const newErrors = [...languageErrors];
    newErrors[index] = {};
    setLanguageErrors(newErrors);
    
    setSpokenLanguages(newLanguages);
  };

  const handleLanguageToLearnChange = (language, proficiency) => {
    if (!language && !proficiency) {
      setLanguageToLearn(null);
    } else {
      setLanguageToLearn({ language, proficiency });
    }
  };

  const handleRemoveLanguageToLearn = () => {
    setLanguageToLearn(null);
  };

  const onSubmit = async (data) => {
    if (!validateLanguages()) {
      return;
    }

    const formData = new FormData();
    if (profileImage) {
      formData.append("profile_image", profileImage);
    } else if (deleteImage) {
      formData.append("profile_image", "");
    }
    
    formData.append("name", data.name);
    formData.append("country", data.country);
    formData.append("language_spoken", JSON.stringify(spokenLanguages));
    if (languageToLearn) {
      formData.append("language_to_learn", JSON.stringify([languageToLearn]));
    } else {
      formData.append("language_to_learn", JSON.stringify([]));
    }
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      await axiosInstance.patch(`users/${userId}/`, formData);
      setEditMode(false);
      fetchUserData();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const { email, profile_image, balance_credits, name } = studentData || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-20">
        {/* Profile Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Profile</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your personal information and language preferences
          </p>
        </div>

        {/* Navigation Tabs */}
        <nav className="max-w-4xl mx-auto mb-8 flex space-x-1 rounded-xl bg-blue-50 p-1">
          {[
            { label: 'Profile', path: '/profile', active: true },
            { label: 'Security', path: '/student-password-change' },
            { label: 'Bookings', path: '/bookings' },
            { label: 'Refer a friend', path: '/refer' }
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200
                ${tab.active 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
                {editMode ? (
                  <div className="space-y-4">
                    <input 
                      type="file" 
                      onChange={handleProfileImageChange} 
                      accept="image/*"
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    />
                    {(profile_image || profileImage) && !deleteImage && (
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <FaTrash className="w-4 h-4" />
                        Delete Image
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Avatar src={profile_image} name={name || ''} size={200} />
                  </div>
                )}
                
                {/* Credits Display */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600 mb-1">Available Credits</p>
                  <p className="text-3xl font-bold text-blue-600">{balance_credits}</p>
                </div>
              </div>
            </div>

            {/* Profile Info Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                  {editMode ? (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleEditToggle}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                      >
                        Save Changes
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                      <FaEdit /> Edit Profile
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Basic Info Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        editMode 
                          ? 'bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                      } transition-colors`}
                      disabled={!editMode}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={email ?? "N/A"}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    {editMode ? (
                      <select
                        {...register("country")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                      >
                        {countries.map(([name, code]) => (
                          <option key={code} value={name}>{name}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={studentData?.country ?? "N/A"}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed"
                        readOnly
                      />
                    )}
                  </div>

                  {/* Languages Spoken Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FaGlobe className="text-green-600 text-xl" />
                      <h3 className="text-lg font-semibold text-gray-800">Languages Spoken</h3>
                    </div>

                    {formErrors.spokenLanguages && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.spokenLanguages}</p>
                              )}

                    {spokenLanguages.length === 0 ? (
                      <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <p className="text-gray-500">No languages selected</p>
                      </div>
                    ) : (
                      spokenLanguages.map((lang, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex-1">
                              <select
                                value={lang.language}
                                onChange={(e) => handleSpokenLanguageChange(index, 'language', e.target.value)}
                                disabled={!editMode}
                                className={`w-full px-4 py-2 rounded-lg border ${
                                  editMode ? 'bg-white hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200' 
                                  : 'bg-gray-50 cursor-not-allowed'
                                } ${languageErrors[index]?.language ? 'border-red-500' : ''} transition-colors`}
                              >
                                <option value="">Select Language</option>
                                {availableLanguages.map((l) => (
                                  <option 
                                    key={l.id || l} 
                                    value={l.name || l}
                                    disabled={spokenLanguages.some((existing, i) => 
                                      i !== index && existing.language === (l.name || l)
                                    )}
                                  >
                                    {l.name || l}
                                  </option>
                                ))}
                              </select>
                              {languageErrors[index]?.language && (
                                <p className="text-red-500 text-sm mt-1">{languageErrors[index].language}</p>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <select
                                value={lang.proficiency}
                                onChange={(e) => handleSpokenLanguageChange(index, 'proficiency', e.target.value)}
                                disabled={!editMode || index === 0}
                                className={`w-full px-4 py-2 rounded-lg border ${
                                  index === 0 || !editMode ? 'bg-gray-50 cursor-not-allowed' 
                                  : 'bg-white hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                                } ${languageErrors[index]?.proficiency ? 'border-red-500' : ''} transition-colors`}
                              >
                                {index === 0 ? (
                                  <option value="Native">Native</option>
                                ) : (
                                  spokenProficiencyLevels
                                    .filter(level => level.level !== 'Native')
                                    .map((level) => (
                                      <option key={level.level} value={level.level}>
                                        {level.description}
                                      </option>
                                    ))
                                )}
                              </select>
                              {languageErrors[index]?.proficiency && (
                                <p className="text-red-500 text-sm mt-1">{languageErrors[index].proficiency}</p>
                              )}
                            </div>
                            
                            {editMode && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSpokenLanguage(index)}
                                className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                                aria-label="Remove language"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    
                    {editMode && (
                      <button
                        type="button"
                        onClick={handleAddSpokenLanguage}
                        className="mt-4 bg-green-50 text-green-600 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2 font-medium"
                      >
                        + Add Language
                      </button>
                    )}
                  </div>

                  {/* Language to Learn Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language to Learn</label>
                    {editMode ? (
                      <>
                        {formErrors.languageToLearn && (
                          <p className="text-red-500 text-sm mb-2">{formErrors.languageToLearn}</p>
                        )}
                        <div className="flex gap-4">
                          <select
                            value={languageToLearn?.language || ''}
                            onChange={(e) => handleLanguageToLearnChange(e.target.value, languageToLearn?.proficiency || learningProficiencyLevels[0]?.level)}
                            className="flex-1 px-4 py-2 rounded-lg border bg-white"
                          >
                            <option value="">Select Language</option>
                            {platformLanguages.map((lang) => (
                              <option key={lang.id || lang} value={lang.name || lang}>{lang.name || lang}</option>
                            ))}
                          </select>
                          <select
                            value={languageToLearn?.proficiency || ''}
                            onChange={(e) => handleLanguageToLearnChange(languageToLearn?.language || '', e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border bg-white"
                          >
                            {learningProficiencyLevels.map((level) => (
                              <option key={level.level} value={level.level}>
                                {level.description}
                              </option>
                            ))}
                          </select>
                          {languageToLearn && (
                            <button
                              type="button"
                              onClick={handleRemoveLanguageToLearn}
                              className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                              aria-label="Remove language to learn"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="w-full">
                        {languageToLearn ? (
                          <div className="flex gap-4">
                            <input
                              type="text"
                              value={languageToLearn.language}
                              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed"
                              readOnly
                            />
                            <input
                              type="text"
                              value={languageToLearn.proficiency}
                              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed"
                              readOnly
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <p className="text-gray-500">No languages selected</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;