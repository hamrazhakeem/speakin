import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEdit, FaGlobe, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useAxios from '../hooks/useAxios';

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
      const response = await axiosInstance.get(`get_user/`);
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
      const countriesResponse = await axiosInstance.get(`get_countries/`);
      setCountries(countriesResponse.data);

      // Fetch available languages and proficiency levels for speaking
      const spokenLanguagesResponse = await axiosInstance.get(`get_spoken_languages/`);
      setAvailableLanguages(spokenLanguagesResponse.data.languages);
      setSpokenProficiencyLevels(spokenLanguagesResponse.data.proficiencies);

      // Fetch platform languages and learning proficiency levels
      const platformLanguagesResponse = await axiosInstance.get(`get_platform_languages/`);
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
      await axiosInstance.patch(`update_user/`, formData);
      setEditMode(false);
      fetchUserData();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const { email, profile_image, balance_credits } = studentData || {};

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Student Profile</h1>

            <nav className="flex space-x-6 mb-8 border-b pb-4">
              <button className="text-green-600 font-semibold text-lg hover:text-green-800 transition-colors">Profile</button>
              <button className="text-gray-600 text-lg hover:text-green-600 transition-colors" onClick={() => navigate('/student-password-change')}>Security</button>
              <button className="text-gray-600 text-lg hover:text-green-600 transition-colors">My Bookings</button>
              <button className="text-gray-600 text-lg hover:text-green-600 transition-colors">Refer a friend</button>
            </nav>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Picture Section */}
              <div className="lg:col-span-1">
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                  {editMode ? (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                      <input 
                        type="file" 
                        onChange={handleProfileImageChange} 
                        accept="image/*"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      {(profile_image || profileImage) && !deleteImage && (
                        <button
                          type="button"
                          onClick={handleDeleteImage}
                          className="bg-red-500 text-white py-2 px-4 rounded-full flex items-center justify-center w-full hover:bg-red-600 transition-colors"
                        >
                          <FaTrash className="mr-2" /> Delete Image
                        </button>
                      )}
                    </div>
                  ) : profile_image && !deleteImage ? (
                    <img
                      src={profile_image}
                      alt="Profile"
                      className="h-64 w-64 rounded-full mx-auto object-cover shadow-lg"
                    />
                  ) : (
                    <div className="bg-gray-200 h-64 w-64 rounded-full mx-auto flex items-center justify-center shadow-inner">
                      <span className="text-7xl text-gray-400">📷</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Information */}
              <div className="lg:col-span-2">
                <div className="bg-gray-100 p-8 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold text-gray-800">Profile Info</h2>
                    <div className="flex space-x-4">
                      <div className="bg-white px-4 py-2 rounded-full shadow text-center">
                        <p className="text-sm text-gray-600">Credits</p>
                        <p className="text-2xl font-bold text-green-600">{balance_credits}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="w-full px-4 py-2 rounded-lg border bg-white"
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
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      {editMode ? (
                        <select
                          {...register("country", { required: true })}
                          className="w-full px-4 py-2 rounded-lg border bg-white"
                        >
                          {countries.map(([name, code]) => (
                            <option key={code} value={name}>{name}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={studentData?.country ?? "N/A"}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed"
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

                    <div className="flex justify-end mt-6">
                      {editMode ? (
                        <>
                          <button
                            type="button"
                            onClick={handleEditToggle}
                            className="bg-gray-400 text-white py-2 px-6 rounded-lg mr-4 hover:bg-gray-500 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Save Changes
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={handleEditToggle}
                          className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                          <FaEdit className="mr-2" /> Edit Profile
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;