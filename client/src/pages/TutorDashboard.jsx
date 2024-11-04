import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import TutorNavbar from "../components/TutorNavbar";
import { FaEdit, FaStar, FaTrash } from 'react-icons/fa';
import useAxios from "../hooks/useAxios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"; // Import useForm
import { toast } from "react-toastify";

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
      console.log('Tutor Data:', response.data);

      const countriesResponse = await axiosInstance.get(`get_countries/`);
      setCountries(countriesResponse.data); 

      const spokenLanguagesResponse = await axiosInstance.get(`get_spoken_languages/`);
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
      await axiosInstance.patch(`update_user/${userId}/`, formData);
      console.log("Profile updated successfully");
      setEditMode(false); // Exit edit mode
      fetchUserData(); // Refetch user data 
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

  const handleTeachingLanguageEdit = () => {
    setIsLanguageModalOpen(true);
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
    <div className="flex flex-col min-h-screen bg-gray-100">
      <TutorNavbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Tutor Profile</h1>

            <nav className="flex space-x-6 mb-8 border-b pb-4">
              <button className="text-blue-600 font-semibold text-lg hover:text-blue-800 transition-colors">Profile</button>
              <button className="text-gray-600 text-lg hover:text-blue-800 transition-colors" onClick={()=>navigate('/tutor-password-change')}>Security</button>
              <button className="text-gray-600 text-lg hover:text-blue-600 transition-colors">Sessions</button>
              <button className="text-gray-600 text-lg hover:text-blue-600 transition-colors">Payments</button>
            </nav>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Picture */}
              <div className="lg:col-span-1">
                <div className="bg-gray-200 p-6 rounded-lg shadow-md">
                  {editMode ? (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                      <input 
                        type="file" 
                        onChange={handleProfileImageChange} 
                        accept="image/*"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                    <div className="bg-gray-300 h-64 w-64 rounded-full mx-auto flex items-center justify-center shadow-inner">
                      <span className="text-7xl text-gray-400">📷</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Information */}
              <div className="lg:col-span-2">
                <div className="bg-gray-200 p-8 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold text-gray-800">Your Ratings</h2>
                    <div className="flex items-center bg-white px-4 py-2 rounded-full shadow">
                      <span className="text-3xl font-bold mr-2 text-gray-800">
                        {rating ?? 'N/A'}
                      </span>
                      <FaStar className="text-yellow-400 text-3xl" />
                      <span className="ml-2 text-sm text-gray-600">({total_reviews ?? 0} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SpeakIn Name</label>
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
                        placeholder="Enter your SpeakIn name"
                        className={`w-full px-4 py-2 rounded-lg border bg-gray-100 ${errors.speakinName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                  className="text-red-600 hover:text-red-800 p-2"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={handleAddLanguage}
                            className="mt-4 w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
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
                    onClick={handleTeachingLanguageEdit}
                    className="mt-2 text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
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
                            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Save Changes
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={handleEditToggle}
                          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <FaEdit className="mr-2" /> Edit Profile
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <Modal
              isOpen={isLanguageModalOpen}
              onClose={() => setIsLanguageModalOpen(false)}
              onProceed={handleProceedToLanguageEdit}
            >
              <h2 className="text-2xl font-bold mb-4">Add New Teaching Language</h2>
              <p className="text-gray-600 mb-4">
              Adding a new language to teach requires approval, which may take up to one business day. You&apos;ll need to submit necessary documents, similar to your initial tutor verification process. In the meantime, you can continue teaching with your current language. We&apos;ll notify you once your request has been reviewed via your email. Please note that after approval, your current language will be removed from your profile, and you&apos;ll only be able to teach the newly approved language.
              </p>
            </Modal>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TutorDashboard;
