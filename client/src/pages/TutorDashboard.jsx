import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { FaEdit, FaStar, FaTrash } from 'react-icons/fa';
import useAxios from "../hooks/useAxios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"; // Import useForm
import { toast } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { updateRequiredCredits } from "../redux/authSlice";
import Avatar from "../components/Avatar";
import Navbar from "../components/Navbar";
import { ChevronRight } from "lucide-react";
import LoadingSpinner from '../components/ui/LoadingSpinner';


const TutorDashboard = () => {
  const axiosInstance = useAxios();
  const userId = useSelector((state) => state.auth.userId);
  const [tutorData, setTutorData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [editMode, setEditMode] = useState(false); // Track edit mode
  const [profileImage, setProfileImage] = useState(null);
  const [country, setCountry] = useState("");
  const [deleteImage, setDeleteImage] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [proficiencies, setProficiencies] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const dispatch = useDispatch();
  const [showLanguageChangeModal, setShowLanguageChangeModal] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

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
    } finally {
      setPageLoading(false);
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
    setSaveLoading(true);
    const formData = new FormData();
    if (profileImage) {
      formData.append("profile_image", profileImage);
    } else if (deleteImage) {
      formData.append("profile_image", "");
    }
    formData.append("speakin_name", data.speakinName);
    formData.append("country", data.country);
    formData.append("required_credits", data.requiredCredits);
    formData.append("language_spoken", JSON.stringify(selectedLanguages));

    try {
      await axiosInstance.patch(`users/${userId}/`, formData);
      setEditMode(false);
      fetchUserData();
      dispatch(updateRequiredCredits(parseInt(data.requiredCredits)));
      if (!showLanguageChangeModal) {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      if (errorMessage.includes("duplicate key value violates unique constraint")) {
        toast.error("The selected SpeakIn name is already taken. Please choose a different one.");
      } else {
        toast.error("Error updating profile: " + errorMessage);
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const handleProceedToLanguageEdit = () => {
    setShowLanguageChangeModal(false);
    setEditMode(false);
    navigate("/tutor/teaching-languages");
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
  const { rating, total_reviews, about } = tutor_details || {};

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

  const LanguageChangeModal = () => {
    if (!showLanguageChangeModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
          {/* Header */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold text-gray-900">
              Change Teaching Language Request
            </h3>
            <div className="mt-4 space-y-3 text-gray-600">
              <p>
                Please note that changing your teaching language requires admin verification, which typically takes 1-2 business days.
              </p>
              <p className="font-medium text-blue-600">
                During the verification period, you can continue teaching your current language.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              onClick={() => setShowLanguageChangeModal(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleProceedToLanguageEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Change
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-16">
        {pageLoading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" className="text-blue-600" />
          </div>
        ) : (
          <>
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
                { label: 'Profile', path: '/tutor/dashboard', active: true },
                { label: 'Security', path: '/tutor/password' },
                { label: 'Sessions', path: '/tutor/sessions' },
                { label: 'Payments', path: '/withdraw' }
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
                <div className="flex justify-center">
                  <Avatar src={profile_image} name={tutorData?.name || ''} size={200} />
                </div>
                    {/* Profile Image Info */}
                    {editMode && (
                    <p className="mt-4 text-sm text-gray-600 text-center">
                      To update your profile picture, please include it in your teaching language update request. This helps us maintain professional standards across the platform.
                    </p>
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
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
  <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
  {editMode ? (
    <div className="flex flex-wrap w-full sm:w-auto gap-2 sm:gap-3">
      <button
        type="button"
        onClick={handleEditToggle}
        className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
        disabled={saveLoading}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        disabled={saveLoading}
      >
        {saveLoading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={handleEditToggle}
      className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
    >
      Edit Profile
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
                                /^[a-z]+$/.test(value) || 'Name must only contain lowercase letters',
                              noStartingOrEndingSpaces: (value) =>
                                value.trim() === value || 'Name must not start or end with spaces',
                              lowercase: (value) => 
                                value === value.toLowerCase() || 'Name must be in lowercase',
                            },
                          })}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border text-xs sm:text-sm ${
                            editMode 
                              ? 'bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                              : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                          } transition-colors`}
                          disabled={!editMode}
                          placeholder="Lowercase letters only"
                          onChange={(e) => {
                            // Convert to lowercase before updating
                            const value = e.target.value.toLowerCase();
                            e.target.value = value;
                            register('speakinName').onChange(e);
                          }}
                        />
                        {errors.speakinName && (
                          <p className="text-red-500 text-sm mt-1">{errors.speakinName.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">About</label>
                        <textarea
                          value={about || "No description available"}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed resize-none"
                          rows={4}
                          readOnly
                        />
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
                        <div className="max-h-[200px] overflow-y-auto bg-white border border-gray-100 rounded-lg p-4">

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
                          <div className="flex items-center justify-between mt-4">
                            <button 
                              onClick={() => setShowLanguageChangeModal(true)}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              <FaEdit className="w-4 h-4" /> Edit Teaching Language
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </>
        )}
      </main>
      <Footer />

      {/* Modal */}
      <LanguageChangeModal />
    </div>
  );
};

export default TutorDashboard;
