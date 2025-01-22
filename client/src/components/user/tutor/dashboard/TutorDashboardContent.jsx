import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { updateRequiredCredits } from "../../../../redux/authSlice";
import { FaEdit, FaTrash } from 'react-icons/fa';
import useAxios from "../../../../hooks/useAxios";
import { tutorApi } from "../../../../api/tutorApi";
import LoadingSpinner from "../../../common/ui/LoadingSpinner";
import NavigationTabs from "../../common/ui/profile/NavigationTabs";
import LanguageList from "../../common/ui/profile/LanguageList";
import ConfirmationModal from "./ConfirmationModal";
import FormInput from '../../common/ui/input/FormInput';
import ProfilePicture from '../../common/ui/profile/ProfilePicture';

const TutorDashboardContent = () => {
    const axiosInstance = useAxios();
    const userId = useSelector((state) => state.auth.userId);
    const [tutorData, setTutorData] = useState(null);
    const [countries, setCountries] = useState([]);
    const [editMode, setEditMode] = useState(false); // Track edit mode
    const [country, setCountry] = useState("");
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
  
    const tabs = [
      { label: 'Profile', path: '/tutor/dashboard', active: true },
      { label: 'Security', path: '/tutor/password' },
      { label: 'Sessions', path: '/tutor/sessions' },
      { label: 'Payments', path: '/withdraw' }
    ];
  
    async function fetchUserData() {
      try {
        const [tutorResponse, countriesResponse, languagesResponse] = await Promise.all([
          tutorApi.getUser(axiosInstance, userId),
          tutorApi.getCountries(axiosInstance), 
          tutorApi.getSpokenLanguages(axiosInstance)
        ]);   

        setTutorData(tutorResponse);
        if (tutorResponse.language_spoken) {
          setSelectedLanguages(tutorResponse.language_spoken);
        }
        setValue("speakinName", tutorResponse.tutor_details?.speakin_name || "");
        setValue("country", tutorResponse.country || "");
        setValue("requiredCredits", tutorResponse.tutor_details?.required_credits || "");
        setValue("email", tutorResponse.email || "");
        setValue("name", tutorResponse.name || "");
        setCountry(tutorResponse.country || "");
        console.log('Tutor Data:', tutorResponse)
        sessionStorage.setItem('teachingLanguage', tutorResponse.tutor_language_to_teach[0].language);
        setCountries(countriesResponse); 
  
        const languagesWithIds = languagesResponse.languages.map((lang, index) => ({
          id: typeof lang === 'string' ? `lang-${index}` : lang.id || `lang-${index}`,
          name: typeof lang === 'string' ? lang : lang.name
        }));
  
        // Ensure each proficiency has a unique id
        const proficienciesWithIds = languagesResponse.proficiencies.map((prof, index) => ({
          id: typeof prof === 'string' ? `prof-${index}` : prof.id || `prof-${index}`,
          level: typeof prof === 'string' ? prof : prof.level,
          description: typeof prof === 'string' ? prof : prof.description || prof.level
        }));
  
        setLanguages(languagesWithIds);
        setProficiencies(proficienciesWithIds);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to load profile data');
      } finally {
        setPageLoading(false);
      }
    }
  
    useEffect(() => {
      fetchUserData();
    }, []);
  
    const handleEditToggle = () => {
      setEditMode(!editMode); // Toggle edit mode
      console.log('Toggle edit mode', editMode);
    };
  
    const onSubmit = async (data) => {
      setSaveLoading(true);
      const formData = new FormData();
      formData.append("speakin_name", data.speakinName);
      formData.append("country", data.country);
      formData.append("required_credits", data.requiredCredits);
      formData.append("language_spoken", JSON.stringify(selectedLanguages));
  
      try {
        await tutorApi.updateUser(axiosInstance, userId, formData);
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
    const { about } = tutor_details || {};
  
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
    <div className="flex-1 bg-gradient-to-b from-blue-50 to-white">
    <main className="container mx-auto px-4 py-8">
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
            <NavigationTabs tabs={tabs} />
            
            {/* Main Content */}
            <div className="max-w-6xl mx-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Picture Card */}
                <div className="lg:col-span-1">
                  <ProfilePicture 
                    profileImage={profile_image}
                    name={tutorData?.name || ''}
                    editMode={editMode}
                  />
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
                        <FormInput
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
                          placeholder="Lowercase letters only"
                          disabled={!editMode}
                          error={errors.speakinName}
                          onChange={(e) => {
                            // Convert to lowercase before updating
                            const value = e.target.value.toLowerCase();
                            e.target.value = value;
                            register('speakinName').onChange(e);
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">About</label>
                        <FormInput
                          type="textarea"
                          value={about || "No description available"}
                          className="resize-none"
                          rows={4}
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <FormInput
                          type="email"
                          value={email ?? "N/A"}
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        {editMode ? (
                          <select
                            {...register("country", { required: true })}
                            className={`w-full px-4 py-3 rounded-xl border bg-gray-50 ${
                              errors.country ? 'border-red-300' : 'border-gray-200'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          >
                            {countries.map(([name, code]) => (
                              <option key={code} value={name}>
                                {name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <FormInput
                            type="text"
                            value={country ?? "N/A"}
                            readOnly
                          />
                        )}
                        {errors.country && <p className="text-red-500 text-sm mt-1">This field is required</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Required Credits</label>
                        <FormInput
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
                          disabled={!editMode}
                          error={errors.requiredCredits}
                        />
                      </div>

                      {/* Languages section */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                          <div className="space-y-6">
                            {editMode ? (
                              <div className="space-y-4 max-h-[200px] overflow-y-auto scrollbar-thin pr-2">
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
                              <LanguageList 
                                languages={language_spoken} 
                                getProficiencyColor={getProficiencyColor} 
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language you Teach</label>
                        <FormInput
                          type="text"
                          value={
                            tutor_language_to_teach.length > 0
                              ? tutor_language_to_teach
                                  .map((languageObj) => `${languageObj.language} (${languageObj.is_native ? "Native" : "Non-native"})`)
                                  .join(", ")
                              : "N/A"
                          }
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

      <ConfirmationModal
        show={showLanguageChangeModal}
        title="Change Teaching Language Request"
        description="Please note that changing your teaching language requires admin verification, which typically takes 1-2 business days."
        additionalInfo="During the verification period, you can continue teaching your current language."
        onCancel={() => setShowLanguageChangeModal(false)}
        onConfirm={handleProceedToLanguageEdit}
        confirmText="Proceed to Change"
      />
    </div>
  )
}

export default TutorDashboardContent