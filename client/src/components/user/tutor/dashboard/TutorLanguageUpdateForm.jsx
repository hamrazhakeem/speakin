import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import useAxios from '../../../../hooks/useAxios';
import { tutorApi } from '../../../../api/tutorApi';
import FormInput from '../../common/ui/input/FormInput';
import FileUpload from '../../common/ui/input/FileUpload';
import PrimaryButton from '../../common/ui/buttons/PrimaryButton';
import ProfileImageUpload from '../../common/ui/input/ProfileImageUpload';

const TutorLanguageUpdateForm = () => {
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profilePreview, setProfilePreview] = useState(null);
    const [profileImageFile, setProfileImage] = useState(null);
    const [languagesToTeach, setLanguagesToTeach] = useState([]);
    const [imageFile, setImage] = useState(null);
    const [videoFile, setVideo] = useState(null);

    const { control, handleSubmit, register, watch, formState: { errors } } = useForm({
      defaultValues: {
        isNative: "true",
        fullName: '',
        teachingLanguage: '',
        about: '',
      },
    });
  
    const handleProfileImage = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5242880) { // 5MB
          toast.error('Image size should be less than 5MB');
          return;
        }
        setProfileImage(file);
        setProfilePreview(URL.createObjectURL(file));
      }
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await tutorApi.getPlatformLanguages(axiosInstance);
          setLanguagesToTeach(response.languages);
        } catch (error) {
          console.error('Error fetching languages:', error);
          toast.error('Failed to fetch languages');
        }
      };
      fetchData();
    }, []);
  
    const isNative = watch("isNative");
  
    const validateImage = useCallback((e) => {
      const file = e.target?.files?.[0];
      
      if (!file) {
        toast.error("Image is required.");
        return;
      }

      // Validate image type and extension
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const validExtensions = ['jpg', 'jpeg', 'png'];
      const extension = file.name.split('.').pop().toLowerCase();

      if (!allowedTypes.includes(file.type) || !validExtensions.includes(extension)) {
        toast.error('Please upload only JPG or PNG images');
        e.target.value = null;
        return;
      }

            // Check file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
              toast.error('Image size should be less than 5MB');
              e.target.value = null;
              return;
            }

      setImage(file);
    }, []);
    
    const validateVideo = useCallback((e) => {
      const file = e.target?.files?.[0];
    
      if (!file) {
        toast.error("Video is required.");
        return;
      }

      // Check if it's a video file
      if (!file.type.startsWith('video/')) {
        toast.error('Please upload a valid video file');
        e.target.value = null;
        return;
      }

      // Check file size (100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast.error('Video size should be less than 100MB');
        e.target.value = null;
        return;
      }
      
      setVideo(file);
    }, []);
  
    const onSubmit = async (data) => {
      setIsSubmitting(true);
  
      try {
        const formData = new FormData();
        formData.append("full_name", data.fullName);
        formData.append("new_language", data.teachingLanguage);
        formData.append("is_native", data.isNative);
        formData.append("about", data.about);
        formData.append("imageUpload", imageFile);
        formData.append("intro_video", videoFile);
        if (profileImageFile) {
          formData.append('profile_image', profileImageFile);
        }
  
        await tutorApi.submitLanguageChangeRequest(axiosInstance, formData);
        toast.success("Request submitted successfully, the status will be notified.");
        navigate('/tutor/dashboard');
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
      <main className="flex-grow container mx-auto px-4 py-8 mt-4 mb-10">
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
                <FormInput
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
                  placeholder="Enter your full name"
                  error={errors.fullName}
                />

                <ProfileImageUpload
                  profilePreview={profilePreview}
                  handleProfileImage={handleProfileImage}
                />

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

                <Controller
                  control={control}
                  name="isNative"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Native Speaker</label>
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
                    </div>
                  )}
                />

                <div className="space-y-6 bg-gray-50 rounded-xl p-6">
                  <Controller
                    name="imageUpload"
                    control={control}
                    rules={{ 
                      required: 'Image is required',
                      validate: {
                        checkFileType: (value) => {
                          if (!value) return true;

                          const file = value instanceof File ? value : 
                                    (value.target && value.target.files ? value.target.files[0] : null);

                          if (!file) return true;

                          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                          const validExtensions = ['jpg', 'jpeg', 'png'];
                          const extension = file.name.split('.').pop().toLowerCase();
                          
                          if (!allowedTypes.includes(file.type)) {
                            return 'Please upload only JPG or PNG images';
                          }
                          if (!validExtensions.includes(extension)) {
                            return 'Please upload only JPG or PNG images';
                          }
                          if (file.size > 5 * 1024 * 1024) {
                            return 'Image size should be less than 5MB';
                          }
                          return true;
                        }
                      }
                    }}
                    render={({ field: { onChange, value } }) => (
                      <FileUpload
                        label={isNative === "true" ? 'Upload Your Government ID' : 'Upload Your Teaching Certificate'}
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => {
                          validateImage(e);
                          onChange(e.target.files[0]);
                        }}
                        error={errors.imageUpload}
                        maxSize={5}
                      />
                    )}
                  />

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
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">About</label>
                        <textarea
                          {...field}
                          placeholder="Tell us about yourself and your teaching experience"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-sm min-h-[120px]"
                          rows={4}
                        />
                        {errors.about && (
                          <p className="text-red-500 text-xs mt-1">{errors.about.message}</p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="videoUpload"
                    control={control}
                    rules={{ 
                      required: 'Video is required',
                      validate: {
                        checkFileType: (value) => {
                          if (!value) return true;

                          const file = value instanceof File ? value : 
                                    (value.target && value.target.files ? value.target.files[0] : null);

                          if (!file) return true;

                          if (!file.type.startsWith('video/')) {
                            return 'Please upload a valid video file';
                          }
                          if (file.size > 100 * 1024 * 1024) {
                            return 'Video size should be less than 100MB';
                          }
                          return true;
                        }
                      }
                    }}
                    render={({ field: { onChange, value } }) => (
                      <FileUpload
                        label="Introduction Video"
                        accept="video/*"
                        onChange={(e) => {
                          validateVideo(e);
                          onChange(e.target.files[0]);
                        }}
                        error={errors.videoUpload}
                        maxSize={100}
                      />
                    )}
                  />
                </div>

                <div className="flex justify-end pt-6">
                  <PrimaryButton
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Submit Request
                  </PrimaryButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TutorLanguageUpdateForm