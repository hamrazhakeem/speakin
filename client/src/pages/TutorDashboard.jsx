import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { FaEdit, FaStar, FaTrash, FaChevronRight } from 'react-icons/fa';
import useAxios from "../hooks/useAxios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"; // Import useForm
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateRequiredCredits } from "../redux/authSlice";
import Avatar from "../components/Avatar";
import Navbar from "../components/Navbar";
import { ChevronRight } from "lucide-react";

const Modal = ({ isOpen, onClose, onProceed, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full m-4">
        <div className="mb-4">{children}</div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};


const TutorDashboard = () => {
  const axiosInstance = useAxios();
  const userId = useSelector((state) => state.auth.userId);
  const [tutorData, setTutorData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [editMode, setEditMode] = useState(false); // Track edit mode
  const [profileImage, setProfileImage] = useState(null);
  const [country, setCountry] = useState("");
  const [deleteImage, setDeleteImage] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [proficiencies, setProficiencies] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const dispatch = useDispatch();

  const navigate = useNavigate(); // For navigation

  const {
    register,  // Register form inputs
    handleSubmit, // Handle form submission
    setValue,     // Set default values dynamically
    formState: { errors }  // Get validation errors
  } = useForm();

  async function fetchUserData() {
    try {
      const response = await axiosInstance.get(`users/${userId}/`);

      setTutorData(response.data);
      if (response.data.language_spoken) {
        setSelectedLanguages(response.data.language_spoken);
      }
      setValue("speakinName", response.data.tutor_details?.speakin_name || "");
      setValue("country", response.data.country || "");
      setValue("requiredCredits", response.data.tutor_details?.required_credits || "");
      setValue("email", response.data.email || "");
      setValue("name", response.data.name || "");
      setCountry(response.data.country || "");
      console.log('Tutor Data:', response.data)
      sessionStorage.setItem('teachingLanguage', response.data.tutor_language_to_teach[0].language);
      const countriesResponse = await axiosInstance.get(`countries/`);
      setCountries(countriesResponse.data); 

      const spokenLanguagesResponse = await axiosInstance.get(`spoken-languages/`);
      const languagesWithIds = spokenLanguagesResponse.data.languages.map((lang, index) => {
        if (typeof lang === 'string') {
          return {
            id: `lang-${index}`,
            name: lang
          };
        }
        return {
          id: lang.id || `lang-${index}`,
          name: lang.name || lang
        };
      });

      // Ensure each proficiency has a unique id
      const proficienciesWithIds = spokenLanguagesResponse.data.proficiencies.map((prof, index) => {
        if (typeof prof === 'string') {
          return {
            id: `prof-${index}`,
            level: prof,
            description: prof
          };
        }
        return {
          id: prof.id || `prof-${index}`,
          level: prof.level || prof,
          description: prof.description || prof
        };
      });

      setLanguages(languagesWithIds);
      setProficiencies(proficienciesWithIds);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode); // Toggle edit mode
    setDeleteImage(false);
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

  const onSubmit = async (data) => {
    const formData = new FormData();
    if (profileImage) {
      formData.append("profile_image", profileImage);
    } else if (deleteImage) {
      formData.append("profile_image", "");  // Send empty string to indicate image deletion
    }
    formData.append("speakin_name", data.speakinName);
    formData.append("country", data.country);
    formData.append("required_credits", data.requiredCredits);
    formData.append("language_spoken", JSON.stringify(selectedLanguages));
    console.log('formdata')
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      await axiosInstance.patch(`users/${userId}/`, formData);
      console.log("Profile updated successfully");
      setEditMode(false); // Exit edit mode
      fetchUserData(); // Refetch user data 
      dispatch(updateRequiredCredits(parseInt(data.requiredCredits)))
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      if (errorMessage.includes("duplicate key value violates unique constraint")) {
        toast.error("The selected SpeakIn name is already taken. Please choose a different one.");
      } else {
        toast.error("Error updating profile: " + errorMessage);
      }
      console.error("Error updating profile:", errorMessage);
    }
  };

  const handleProceedToLanguageEdit = () => {
    setIsLanguageModalOpen(false);
    navigate("/edit-teaching-language");
  };

  const handleAddLanguage = () => {
    setSelectedLanguages([...selectedLanguages, { language: "", proficiency: "" }]);
  };

  const handleRemoveLanguage = (indexToRemove) => {
    // Only allow removal if it's not the first language
    if (indexToRemove !== 0) {
      setSelectedLanguages(selectedLanguages.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = [...selectedLanguages];
    // If it's the first language (index 0), only allow changing the language, not the proficiency
    if (index === 0 && field === 'proficiency') {
      return;
    }
    updatedLanguages[index] = {
      ...updatedLanguages[index],
      [field]: value
    };
    // Ensure first language always has Native proficiency
    if (index === 0) {
      updatedLanguages[0].proficiency = 'Native';
    }
    setSelectedLanguages(updatedLanguages);
  };

  const { email, profile_image, tutor_language_to_teach = [], tutor_details, language_spoken = [] } = tutorData || {};
  const { rating, total_reviews } = tutor_details || {};

  const getProficiencyColor = (level) => {
    const colors = {
      'B1': 'bg-teal-100 text-teal-800',
      'B2': 'bg-orange-100 text-orange-800',
      'C1': 'bg-indigo-100 text-indigo-800',
      'C2': 'bg-pink-100 text-pink-800',
      'Native': 'bg-purple-100 text-purple-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-20">
        {/* Profile Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tutor Profile</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your teaching preferences and personal information
          </p>
        </div>

        {/* Navigation Tabs */}
        <nav className="max-w-4xl mx-auto mb-8 flex space-x-1 rounded-xl bg-blue-50 p-1">
          {[
            { label: 'Profile', path: '/tutor-dashboard', active: true },
            { label: 'Security', path: '/tutor-password-change' },
            { label: 'Sessions', path: '/tutor-sessions' },
            { label: 'Payments', path: '/payments' }
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
                    <Avatar src={profile_image} name={tutorData?.name || ''} size={200} />
                  </div>
                )}

                {/* Ratings Display */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600 mb-1">Your Rating</p>
                  <div className="flex items-center justify-center">
                    <span className="text-3xl font-bold text-blue-600 mr-2">
                      {rating ?? 'N/A'}
                    </span>
                    <FaStar className="text-yellow-400 text-2xl" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">({total_reviews ?? 0} reviews)</p>
                </div>
              </div>
            </div>

            {/* Profile Info Card - Adjusted button and text sizes */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Teaching Information</h2>
                  {editMode ? (
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={handleEditToggle}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs sm:text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        Save Changes
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs sm:text-sm"
                    >
                      <FaEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Edit Profile
                    </button>
                  )}
                </div>

                {/* Rest of the form fields with updated styling */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">SpeakIn Name</label>
                    <input
                      type="text"
                      {...register('speakinName', {
                        required: 'SpeakIn Name is required',
                        validate: {
                          noSpacesOrSpecialChars: (value) =>
                            /^[A-Za-z]+$/.test(value) || 'Name must only contain letters',
                          noStartingOrEndingSpaces: (value) =>
                            value.trim() === value || 'Name must not start or end with spaces',
                        },
                      })}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border text-xs sm:text-sm ${
                        editMode 
                          ? 'bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                      } transition-colors`}
                      disabled={!editMode}
                    />
                    {errors.speakinName && (
                      <p className="text-red-500 text-sm mt-1">{errors.speakinName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={email ?? "N/A"}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    {editMode ? (
                      <select
                        {...register("country", { required: true })}
                        className={`w-full px-4 py-2 rounded-lg border bg-gray-100 ${errors.country ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        {countries.map(([name, code]) => (
                          <option key={code} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={country ?? "N/A"}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
                        readOnly
                      />
                    )}
                    {errors.country && <p className="text-red-500 text-sm mt-1">This field is required</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Credits</label>
                    <input
                      type="number"
                      {...register('requiredCredits', {
                        required: 'Credit is required',
                        min: {
                          value: 1,
                          message: 'Credit must be at least 1 credit',
                        },
                      })}
                      min="1"
                      step="1"
                      placeholder="Minimum 1 credit"
                      className={`w-full px-4 py-2 rounded-lg border bg-gray-100 ${errors.requiredCredits ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      disabled={!editMode}
                    />
                    {errors.requiredCredits && (
                      <p className="text-red-500 text-sm mt-1">{errors.requiredCredits.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Languages you can speak</label>
                    {editMode ? (
                      <div className="space-y-4">
                        {selectedLanguages.map((lang, index) => (
                          <div key={index} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex-1">
                              <select
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                                value={lang.language}
                                onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                              >
                                <option value="">Select a language</option>
                                {languages.map((language) => (
                                  <option key={language.id} value={language.name}>
                                    {language.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="flex-1">
                              <select
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                                value={index === 0 ? 'Native' : lang.proficiency}
                                onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
                                disabled={index === 0}
                              >
                                <option value="">Select proficiency</option>
                                {proficiencies.map((prof) => (
                                  <option 
                                    key={prof.id} 
                                    value={prof.level}
                                    disabled={index === 0 && prof.level !== 'Native'}
                                  >
                                    {prof.description}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {index !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveLanguage(index)}
                                className="text-red-600 hover:text-red-800 p-1.5 sm:p-2"
                              >
                                <FaTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={handleAddLanguage}
                          className="mt-4 w-full bg-blue-50 text-blue-600 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center text-xs sm:text-sm"
                        >
                          + Add Language
                        </button>
                      </div>
                    ) : (
                        <div className="space-y-2">
                          {language_spoken && language_spoken.length > 0 ? (
                            language_spoken.map((lang, index) => (
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
                      )}
                    </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language you Teach</label>
                    <input
                      type="text"
                      value={
                        tutor_language_to_teach.length > 0
                          ? tutor_language_to_teach
                              .map((languageObj) => `${languageObj.language} (${languageObj.is_native ? "Native" : "Non-native"})`)
                              .join(", ")
                          : "N/A"
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
                      readOnly
                    />
                    {editMode && (
                      <button
                        type="button"
                        onClick={handleProceedToLanguageEdit}
                        className="mt-2 text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
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

export default TutorDashboard;
