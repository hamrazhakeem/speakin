import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TutorNavbar from '../components/TutorNavbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const TutorRequestPage = () => {
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
  const [languagesToTeach, setLanguagesToTeach] = useState([]);
  const [languagesSpoken, setLanguagesSpoken] = useState([]);
  const [proficiencies, setProficiencies] = useState([]);
  const [video, setVideo] = useState(null);
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isNative = watch('isNative');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch countries
        const countriesResponse = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}get_countries/`);
        if (!countriesResponse.ok) {
          throw new Error('Failed to fetch countries');
        }
        const countriesData = await countriesResponse.json();
        setCountries(countriesData);
        console.log('Countries:', countriesData);
  
        // Fetch languages to teach
        const languagesToTeachResponse = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}get_platform_languages/`);
        if (!languagesToTeachResponse.ok) {
          throw new Error('Failed to fetch languages to teach');
        }
        const languagesToTeachData = await languagesToTeachResponse.json();
        setLanguagesToTeach(languagesToTeachData.languages);
  
        // Fetch spoken languages
        const spokenLanguagesResponse = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}get_spoken_languages/`);
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
  
    // Check file size
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image size must not exceed 2 MB.");
      e.target.value = null;
      return;
    }
    setImage(file)
  }, [])
  
  const handleVideoChange = useCallback((e) => {
    const file = e.target.files[0];
  
    // Check if a file is selected
    if (!file) {
      return toast.error("Video is required.");
    }
  
    // Check file size
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Video size must not exceed 5 MB.");
      e.target.value = null;
      return;
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
    if (loading) {
      toast.info('Submitting your application...');
    }
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
    formData.append('video', video);
    formData.append('image', image);

    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}tutor_request/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        navigate('/application-confirmation');
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
    <div className="flex flex-col min-h-screen">
      <TutorNavbar />
      <main className="flex-1 flex justify-center items-center p-4 mt-16 md:mt-24 mb-10">
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">Tutor Request</h1>
          <p className="text-gray-600 mb-8 text-sm md:text-base text-center">Fill out the form to request to become a tutor</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="speakinName"
                  control={control}
                  rules={{
                    required: 'SpeakIn Name is required',
                    validate: {
                      noSpacesOrSpecialChars: (value) =>
                        /^[A-Za-z]+$/.test(value) || 'Name must only contain letters',
                      noStartingOrEndingSpaces: (value) =>
                        value.trim() === value || 'Name must not start or end with spaces',
                    },
                  }}
                  render={({ field }) => (
                    <InputField
                      {...field}
                      type="text"
                      placeholder="SpeakIn Name"
                      error={errors.speakinName}
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
                    <InputField
                      {...field}
                      type="text"
                      placeholder="Full Name as in Govt ID/Certificate"
                      error={errors.fullName}
                    />
                  )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="email"
              control={control}
              rules={{ 
                required: 'Email is required',
                pattern: {
                  value: /^\S+[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\S*$/i,
                  message: "Invalid email address or contains leading/trailing spaces"
                }
              }}
              render={({ field }) => (
                <InputField
                  {...field}
                  type="email"
                  placeholder="Email"
                  error={errors.email}
                />
              )}
            />
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    validate: {
                      noSpaces: value =>
                        value.trim() === value || 'Password must not start or end with spaces',
                      complexity: value =>
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/.test(value) ||
                        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
                    }
                  }}
                  render={({ field }) => (
                    <InputField
                      {...field}
                      type="password"
                      placeholder="Password"
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
                  rules={{ required: 'Image is required' }}
                  render={({ field }) => (
                    <FileUpload
                      {...field}
                      onChange={(event) => {
                        // Call your existing handleImageChange logic here
                        handleImageChange(event);
                        field.onChange(event); // Ensure react-hook-form state is updated
                      }}
                      accept="image/*"
                      label={`Upload your ${isNative ? 'Government ID' : 'Teaching Certificate'}`}
                      error={errors.image} // Pass error to display it
                    />
                  )}
                />
            </div>

            <div className="space-y-4">
              <label className="font-medium block">Languages You Can Speak:</label>
              <div className="space-y-4 max-h-60 overflow-y-auto p-2 border rounded">
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
                rules={{ required: 'Video is required' }}
                render={({ field }) => (
                  <FileUpload
                    {...field}
                    onChange={(event) => {
                      // Call your existing handleVideoChange logic here
                      handleVideoChange(event);
                      field.onChange(event); // Ensure react-hook-form state is updated
                    }}
                    accept="video/*"
                    label="Upload Introduction Video"
                    error={errors.video} // Pass error to display it
                  />
                )}
              />

            <div className="space-y-2">
              <label className="font-medium block">Set Hourly Rate:</label>
              <p className="text-sm text-gray-600">Set hourly rate in Credits, 1 Credit worth ₹75</p>
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
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                onClick={() => navigate('/tutor-signin')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>

            {errorMessage && <p className="text-red-500 mt-4 text-center">{errorMessage}</p>}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Reusable components
const InputField = forwardRef(({ error, ...props }, ref) => (
  <div>
    <input
      {...props}
      ref={ref}
      className={`w-full p-2 border rounded focus:ring-2 outline-none ${
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
      }`}
    />
    {error && <p className="text-red-500 text-sm">{error.message}</p>}
  </div>
));

const SelectField = forwardRef(({ options, placeholder, error, ...props }, ref) => (
  <div>
    <select
      {...props}
      ref={ref}
      className={`w-full p-2 border rounded focus:ring-2 outline-none ${
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
      }`}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm">{error.message}</p>}
  </div>
));

const RadioButton = forwardRef(({ checked, onChange, label }, ref) => (
  <label className="flex items-center space-x-2 cursor-pointer">
    <input
      type="radio"
      className="form-radio"
      checked={checked}
      onChange={onChange}
      ref={ref}
    />
    <span>{label}</span>
  </label>
));

const FileUpload = forwardRef(({ onChange, accept, label, error }, ref) => (
  <div className="space-y-2">
    <label className="font-medium block">{label}</label>
    <input
      type="file"
      onChange={onChange}
      accept={accept}
      ref={ref}
      className="w-full p-2 border rounded focus:ring-2 outline-none border-gray-300 focus:ring-blue-500"
    />
    {error && <p className="text-red-500 text-sm">{error.message}</p>}
  </div>
));

const SpokenLanguageInput = ({ index, languagesSpoken, proficiencies, control, onRemove, errors }) => (
  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
    <Controller
      name={`spokenLanguages.${index}.language`}
      control={control}
      rules={{ required: 'Language is required' }}
      render={({ field }) => (
        <>
          <select
            {...field}
            className="w-full sm:w-2/5 p-2 border rounded focus:ring-2 outline-none border-gray-300 focus:ring-blue-500"
          >
            <option value="" disabled>Select Language</option>
            {languagesSpoken.map((spokenLang) => (
              <option key={spokenLang.id} value={spokenLang.name}>
                {spokenLang.name}
              </option>
            ))}
          </select>
          {/* Display error message for language */}
          {errors?.spokenLanguages?.[index]?.language && (
            <p className="text-red-500 text-sm">{errors.spokenLanguages[index].language.message}</p>
          )}
        </>
      )}
    />

<Controller
  name={`spokenLanguages.${index}.proficiency`}
  control={control}
  rules={{ required: 'Proficiency is required' }}
  render={({ field }) => (
    <>
      <select
        {...field}
        className="w-full sm:w-2/5 p-2 border rounded focus:ring-2 outline-none border-gray-300 focus:ring-blue-500"
        disabled={index === 0}  // Disable if this is the first language
      >
        {index === 0 ? (
          <option value="Native">Native</option>
        ) : (
          <>
            <option value="" disabled>Select Proficiency</option>
            {proficiencies.map((prof, i) => (
              <option key={i} value={prof.level}>
                {prof.description}
              </option>
            ))}
          </>
        )}
      </select>
      {/* Display error message for proficiency */}
      {errors?.spokenLanguages?.[index]?.proficiency && (
        <p className="text-red-500 text-sm">{errors.spokenLanguages[index].proficiency.message}</p>
      )}
    </>
  )}
/>


    {index !== 0 && (
      <button
        type="button"
        className="w-full sm:w-1/5 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        onClick={onRemove}
      >
        Remove
      </button>
    )}
  </div>
);


export default TutorRequestPage;