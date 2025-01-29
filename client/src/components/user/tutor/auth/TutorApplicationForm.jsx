import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import LoadingSpinner from '../../../common/ui/LoadingSpinner';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ChevronRight, UserCircle } from 'lucide-react';
import InputField from '../../common/ui/input/InputField';
import SelectField from './SelectField';
import RadioButton from '../../common/ui/buttons/RadioButton';
import FileUpload from '../../common/ui/input/FileUpload';
import SpokenLanguageInput from './SpokenLanguageInput';
import FormInput from '../../common/ui/input/FormInput';
import PasswordInput from '../../common/ui/input/PasswordInput';

const TutorApplicationForm = () => {
    const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
          speakinName: '',
          fullName: '',
          email: '',
          password: '',
          country: '',
          teachingLanguage: '',
          isNative: true,
          about: '',
          hourlyRate: '',
          spokenLanguages: [{ language: '', proficiency: 'Native' }]
        }
      });
    
      const [countries, setCountries] = useState([]);
      const [profilePreview, setProfilePreview] = useState(null);
      const [profileImageFile, setProfileImageFile] = useState(null);
      const [languagesToTeach, setLanguagesToTeach] = useState([]);
      const [languagesSpoken, setLanguagesSpoken] = useState([]);
      const [proficiencies, setProficiencies] = useState([]);
      const [video, setVideo] = useState(null);
      const [image, setImage] = useState(null);
      const [errorMessage, setErrorMessage] = useState('');
      const [loading, setLoading] = useState(false);
      const navigate = useNavigate();
      const location = useLocation();
      const verifiedEmail = location.state?.verifiedEmail;
    
      // useEffect(() => {
      //   if (!verifiedEmail) {
      //     navigate('/tutor/verify-email');
      //   }
      // }, [verifiedEmail, navigate]);
    
      const isNative = watch('isNative');
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            // Fetch countries
            const countriesResponse = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}countries/`);
            if (!countriesResponse.ok) {
              throw new Error('Failed to fetch countries');
            }
            const countriesData = await countriesResponse.json();
            setCountries(countriesData);
            console.log('Countries:', countriesData);
      
            // Fetch languages to teach
            const languagesToTeachResponse = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}platform-languages/`);
            if (!languagesToTeachResponse.ok) {
              throw new Error('Failed to fetch languages to teach');
            }
            const languagesToTeachData = await languagesToTeachResponse.json();
            setLanguagesToTeach(languagesToTeachData.languages);
      
            // Fetch spoken languages
            const spokenLanguagesResponse = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}spoken-languages/`);
            if (!spokenLanguagesResponse.ok) {
              throw new Error('Failed to fetch languages spoken');
            }
            const spokenLanguagesData = await spokenLanguagesResponse.json();
            setLanguagesSpoken(spokenLanguagesData.languages);
            setProficiencies(spokenLanguagesData.proficiencies);
            
          } catch (error) {
            console.error(error.message);
          }
        };
      
        fetchData();
      }, []);
    
      const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
      
        // Check if a file is selected
        if (!file) {
          return toast.error("Image is required.");
        }
    
        if (!['image/jpeg', 'image/png', 'image/bmp'].includes(file.type)) {
          toast.error("Invalid file type. Please upload JPG, PNG, or BMP images.");
          e.target.value = null;
          return
        }
        setImage(file)
      }, [])
    
      const handleProfileImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        // More strict file type checking
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          toast.error('Please upload only JPG or PNG images');
          e.target.value = null;
          return;
        }
    
        // Additional check for file extension
        const validExtensions = ['jpg', 'jpeg', 'png'];
        const extension = file.name.split('.').pop().toLowerCase();
        if (!validExtensions.includes(extension)) {
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
    
        setProfileImageFile(file);
        setProfilePreview(URL.createObjectURL(file));
      };
      
      const handleVideoChange = useCallback((e) => {
        const file = e.target.files[0];
      
        // Check if a file is selected
        if (!file) {
          return toast.error("Video is required.");
        }
        setVideo(file)
        // Add your logic to handle the video file here
        console.log("Video uploaded:", file);
      }, [])
    
      const handleAddSpokenLanguage = () => {
        setValue('spokenLanguages', [...watch('spokenLanguages'), { language: '', proficiency: '' }]);
      };
    
      const handleRemoveSpokenLanguage = (index) => {
        if (index === 0) return; // Prevent removing the first language
        const newLanguages = watch('spokenLanguages').filter((_, i) => i !== index);
        setValue('spokenLanguages', newLanguages);
      };
    
      useEffect(() => {
        let toastId;
        if (loading) {
          toastId = toast.loading('Please wait while we upload your introduction video and process your application...');
        }
        return () => {
          if (toastId) {
            toast.dismiss(toastId);
          }
        };
      }, [loading]);
    
      const onSubmit = async (data) => {
        if (data.hourlyRate < 1) {
          setErrorMessage('Hourly rate must be at least 1 credit.');
          return;
        }
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          if (key === 'spokenLanguages') {
            formData.append(key, JSON.stringify(data[key]));
          } else {
            formData.append(key, data[key]);
          }
        });
        formData.append('email', verifiedEmail); // Use verified email
        formData.append('video', video);
        formData.append('image', image);
        if (profileImageFile) {
          formData.append('profile_image', profileImageFile);
        }
    
        setLoading(true);
    
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}tutor-request/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          if (response.status === 201) {
            navigate('/tutor/request/application-confirmation', { state: { verifiedEmail: verifiedEmail } });
          }
        } catch (error) {
          // Check if the error has a response and extract the message
          if (error.response && error.response.data && error.response.data.error) {
            setErrorMessage(error.response.data.error);
          } else {
            setErrorMessage('Failed to submit the request. Please try again later.');
          }
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

  return (
    <div className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <main className="flex justify-center items-center p-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6 md:p-10 mt-16 mb-16">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Become a Tutor</h1>
            <p className="text-gray-600 text-base md:text-lg">Join our community of expert language tutors</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="speakinName"
                  control={control}
                  rules={{
                    required: 'SpeakIn Name is required',
                    validate: {
                      noSpacesOrSpecialChars: (value) =>
                        /^[a-z]+$/.test(value) || 'Name must only contain lowercase letters',
                      noStartingOrEndingSpaces: (value) =>
                        value.trim() === value || 'Name must not start or end with spaces',
                      lowercase: (value) => 
                        value === value.toLowerCase() || 'Name must be in lowercase',
                    },
                  }}
                  render={({ field }) => (
                    <FormInput
                      {...field}
                      type="text"
                      placeholder="SpeakIn Name (lowercase letters only)"
                      error={errors.speakinName}
                      onChange={(e) => {
                        field.onChange(e.target.value.toLowerCase())
                      }}
                    />
                  )}
                />
                <Controller
                  name="fullName"
                  control={control}
                  rules={{
                    required: 'Full Name is required',
                    validate: {
                      validChars: (value) =>
                        /^[a-zA-Z\s'-]+$/.test(value) || 'Full Name must only contain letters, spaces, hyphens, and apostrophes',
                      noMultipleSpaces: (value) =>
                        !/\s{2,}/.test(value) || 'Full Name must not contain multiple spaces between names',
                      noStartingOrEndingSpaces: (value) =>
                        value.trim() === value || 'Full Name must not start or end with spaces',
                    },
                  }}
                  render={({ field }) => (
                    <FormInput
                      {...field}
                      type="text"
                      placeholder="Full Name as in Govt ID/Certificate"
                      error={errors.fullName}
                    />
                  )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters'
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
                      }
                    }}
                    render={({ field }) => (
                      <PasswordInput
                        {...field}
                        placeholder="Enter a strong password"
                        error={errors.password}
                      />
                    )}
                  />
                  
                </div>
              <Controller
                name="country"
                control={control}
                rules={{ required: 'Country is required' }}
                render={({ field }) => (
                  <SelectField
                    {...field}
                    options={countries.map(country => ({ value: country[0], label: country[0] }))}
                    placeholder="Select Country"
                    error={errors.country}
                  />
                )}
              />
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

            <div className="space-y-4">
              <label className="font-medium block">Language You Teach:</label>
              <Controller
                name="teachingLanguage"
                control={control}
                rules={{ required: 'Teaching language is required' }}
                render={({ field }) => (
                  <SelectField
                    {...field}
                    options={languagesToTeach.map(lang => ({ value: lang.name, label: lang.name }))}
                    placeholder="Select Language"
                    error={errors.teachingLanguage}
                  />
                )}
              />

              <div className="flex items-center space-x-4">
                <Controller
                  name="isNative"
                  control={control}
                  render={({ field }) => (
                    <>
                      <RadioButton
                        {...field}
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                        label="Native"
                      />
                      <RadioButton
                        {...field}
                        checked={field.value === false}
                        onChange={() => field.onChange(false)}
                        label="Non-Native"
                      />
                    </>
                  )}
                />
              </div>

              <Controller
                name="image"
                control={control}
                rules={{ 
                  required: 'Image is required',
                  validate: {
                    checkFileType: (value) => {
                      // If no value, skip validation (required rule will handle this)
                      if (!value) return true;

                      // Handle both File object and event cases
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
                    onChange={(event) => {
                      handleImageChange(event);
                      onChange(event.target.files[0]); // Pass the File object directly
                    }}
                    accept=".jpg,.jpeg,.png"
                    maxSize={5}
                    label={`Upload your ${isNative ? 'Government ID' : 'Teaching Certificate'}`}
                    error={errors.image}
                  />
                )}
              />
            </div>

            <div className="space-y-4">
              <label className="font-medium block">Languages You Can Speak:</label>
              <div className="space-y-4 max-h-60 overflow-y-auto p-2 border rounded scrollbar-thin">
                {watch('spokenLanguages').map((lang, index) => (
                  <SpokenLanguageInput
                    key={index}
                    lang={lang}
                    index={index}
                    languagesSpoken={languagesSpoken}
                    proficiencies={proficiencies}
                    control={control}
                    errors={errors} 
                    onRemove={() => handleRemoveSpokenLanguage(index)}
                  />
                ))}
              </div>
              <button
                type="button"
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={handleAddSpokenLanguage}
              >
                Add More Languages
              </button>
            </div>

            <div className="space-y-2">
              <label className="font-medium block">About:</label>
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
                    placeholder="Tell us about yourself"
                    className={`w-full p-2 border rounded focus:ring-2 outline-none ${
                      errors.about ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    rows={4}
                  />
                )}
              />
              {errors.about && <p className="text-red-500 text-sm">{errors.about.message}</p>}
            </div>

            <Controller
              name="video"
              control={control}
              rules={{ 
                required: 'Video is required',
                validate: {
                  checkFileType: (value) => {
                    // If no value, skip validation (required rule will handle this)
                    if (!value) return true;

                    // Handle both File object and event cases
                    const file = value instanceof File ? value : 
                                (value.target && value.target.files ? value.target.files[0] : null);

                    if (!file) return true;

                    // Check if it's a video file
                    if (!file.type.startsWith('video/')) {
                      return 'Please upload a valid video file';
                    }

                    // Check file size (100MB limit)
                    if (file.size > 100 * 1024 * 1024) {
                      return 'Video size should be less than 100MB';
                    }

                    return true;
                  }
                }
              }}
              render={({ field: { onChange, value } }) => (
                <FileUpload
                  onChange={(event) => {
                    handleVideoChange(event);
                    onChange(event.target.files[0]); // Pass the File object directly
                  }}
                  accept="video/*"
                  maxSize={100}
                  label="Upload Introduction Video"
                  error={errors.video}
                />
              )}
            />

            <div className="space-y-2">
              <label className="font-medium block">Set Hourly Rate:</label>
              <p className="text-sm text-gray-600">Set hourly rate in Credits, 1 Credit worth ₹150</p>
              <Controller
                name="hourlyRate"
                control={control}
                rules={{ 
                  required: 'Hourly rate is required',
                  min: {
                    value: 1,
                    message: 'Hourly rate must be at least 1 credit'
                  }
                }}
                render={({ field }) => (
                  <InputField
                    {...field}
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Minimum 1 credit"
                    error={errors.hourlyRate}
                  />
                )}
              />
              <p className="text-sm text-gray-600">SpeakIn Commission - 20%</p>
              <p className="text-sm text-gray-600">We use the funds for getting more students and for constant improvements of our learning platform</p>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                onClick={() => navigate('/tutor/sign-in')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 h-12 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center group"
              >
                {loading ? (
                  <div className="h-5 flex items-center">
                    <LoadingSpinner size="sm"/>
                  </div>
                ) : (
                  <>
                    Submit Request
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {errorMessage && <p className="text-red-500 mt-4 text-center">{errorMessage}</p>}          
            </form>
        </div>
      </main>
    </div>
  )
}

export default TutorApplicationForm