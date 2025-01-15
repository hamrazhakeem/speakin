import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { FaArrowLeft, FaTrash, FaChevronRight } from 'react-icons/fa';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import useAxios from '../hooks/useAxios';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Avatar from "../components/Avatar";
import { UserCircle } from 'lucide-react';

const EditTeachingLanguage = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileImageFile, setprofileImage] = useState(null);

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5242880) { // 5MB
        toast.error('Image size should be less than 5MB');
        return;
      }
      setprofileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  // Set default values in useForm, setting isNative to "true" for native
  const { control, handleSubmit, register, watch, formState: { errors } } = useForm({
    defaultValues: {
      isNative: "true",
      fullName: '',
      teachingLanguage: '',
      about: '',
    },
  });

  const [languagesToTeach, setLanguagesToTeach] = useState([]);
  const [imageFile, setImage] = useState(null);
  const [videoFile, setVideo] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const languagesToTeachResponse = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}platform-languages/`);
        if (!languagesToTeachResponse.ok) throw new Error('Failed to fetch languages to teach');
        const languagesToTeachData = await languagesToTeachResponse.json();
        console.log('languagesToTeachData:', languagesToTeachData);
        setLanguagesToTeach(languagesToTeachData.languages);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };
    fetchData();
  }, []);

  const isNative = watch("isNative");

  const validateImage = useCallback((e) => {
    console.log('helloooooo0')
    const file = e.target?.files?.[0];
    console.log('helooooo1')
    // Check if a file is selected
    if (!file) {
      toast.error("Image is required.");
      return;
    }
  
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/bmp'].includes(file.type)) {
      toast.error("Invalid file type. Please upload JPG, PNG, or BMP images.");
      e.target.value = null;  // Reset input
      return;
    }

    setImage(file);
  }, []);
  
  
  const validateVideo = useCallback((e) => {
    console.log('helloooooo0')
    const file = e.target?.files?.[0];
  
    // Check if a file is selected
    if (!file) {
      toast.error("Video is required.");
      return;
    }
    
    setVideo(file);
    console.log("Video uploaded:", file);
  }, []);
  

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Log the languages array before stringifying (for debugging)
    // Prepare form data
    try {
      const formData = new FormData();
      formData.append("full_name", data.fullName);
      formData.append("new_language", data.teachingLanguage);
      formData.append("is_native", data.isNative);
      formData.append("about", data.about);
      formData.append("imageUpload", imageFile);
      formData.append("intro_video", videoFile);
      if (imageFile) {
        formData.append('profile_image', profileImageFile);
      }

      const response = await axiosInstance.post(`teaching-language-change-requests/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Request submitted successfully, the status will be notified.");
        navigate('/tutor/dashboard');
      }
    } catch (error) {
      console.error('Error editing teaching language:', error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || "An unexpected error occurred. Please try again.");
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Teaching Language</h1>
            <p className="text-base text-gray-600">
              Update your teaching language preferences and credentials
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-blue-50/80 backdrop-blur-sm p-6 border-b border-gray-100">
              <button
                onClick={() => navigate('/tutor/dashboard')}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
              >
                <FaArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8">
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    {...register("fullName", {
                      required: "Full Name is required",
                      validate: {
                        validChars: (value) =>
                          /^[a-zA-Z\s'-]+$/.test(value) || 'Full Name must only contain letters, spaces, hyphens, and apostrophes',
                        noMultipleSpaces: (value) =>
                          !/\s{2,}/.test(value) || 'Full Name must not contain multiple spaces between names',
                        noStartingOrEndingSpaces: (value) =>
                          value.trim() === value || 'Full Name must not start or end with spaces',
                      },
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-sm"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900">Profile Picture</h2>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                      {profilePreview ? (
                        <img 
                          src={profilePreview} 
                          alt="Profile Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <UserCircle className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImage}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label 
                      htmlFor="profile-upload"
                      className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer"
                    >
                      Upload Profile Picture
                    </label>
                    <p className="text-sm text-gray-500">
                      Maximum file size: 5MB. Supported formats: JPG, PNG
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Language You Teach</label>
                  <select
                    {...register("teachingLanguage", { required: "Please select a language to teach" })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-sm"
                  >
                    <option value="">Select Language</option>
                    {languagesToTeach.map((language) => (
                      <option key={language.id} value={language.name}>
                        {language.name}
                      </option>
                    ))}
                  </select>
                  {errors.teachingLanguage && (
                    <p className="text-red-500 text-xs mt-1">{errors.teachingLanguage.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Native Speaker</label>
                  <Controller
                    control={control}
                    name="isNative"
                    render={({ field }) => (
                      <div className="flex gap-6">
                        <label className="relative flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            value="true"
                            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                            checked={field.value === "true"}
                            onChange={() => field.onChange("true")}
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">Native</span>
                        </label>
                        <label className="relative flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            value="false"
                            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                            checked={field.value === "false"}
                            onChange={() => field.onChange("false")}
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">Non-Native</span>
                        </label>
                      </div>
                    )}
                  />
                </div>

                <div className="space-y-6 bg-gray-50 rounded-xl p-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {isNative === "true" ? 'Upload Your Government ID' : 'Upload Your Teaching Certificate'}
                    </label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        {...register("imageUpload", { required: "Image is required." })}
                        onChange={(e) => {
                          validateImage(e);
                          register("imageUpload").onChange(e);
                        }}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                      />
                    </div>
                    {errors.imageUpload && (
                      <p className="text-red-500 text-xs mt-1">{errors.imageUpload.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">About</label>
                    <Controller
                      name="about"
                      control={control}
                      rules={{ 
                        required: 'About section is required',
                        maxLength: {
                          value: 500,
                          message: 'About section cannot exceed 500 characters'
                        },
                      }}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          placeholder="Tell us about yourself and your teaching experience"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-sm min-h-[120px]"
                          rows={4}
                        />
                      )}
                    />
                    {errors.about && (
                      <p className="text-red-500 text-xs mt-1">{errors.about.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Introduction Video</label>
                    <input
                      type="file"
                      accept="video/*"
                      {...register("videoUpload", { required: "Video is required." })}
                      onChange={(e) => {
                        validateVideo(e);
                        register("videoUpload").onChange(e);
                      }}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    />
                    {errors.videoUpload && (
                      <p className="text-red-500 text-xs mt-1">{errors.videoUpload.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center h-12 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 group"
                  >
                    {isSubmitting ? (
                      <div className="h-5 flex items-center">
                        <LoadingSpinner size="sm" className="text-white" />
                      </div>
                    ) : (
                      <>
                        Submit Request
                        <FaChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
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

export default EditTeachingLanguage;
