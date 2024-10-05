import React, { useState } from 'react';
import TutorNavbar from '../components/TutorNavbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const TutorRequestPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [languages, setLanguages] = useState([{ language: '', proficiency: 'native' }]);
  const [isNative, setIsNative] = useState(true);
  const [hourlyRate, setHourlyRate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleAddLanguage = () => {
    setLanguages([...languages, { language: '', proficiency: 'non-native' }]);
  };

  const handleRemoveLanguage = (index) => {
    const newLanguages = languages.filter((_, i) => i !== index);
    setLanguages(newLanguages);
  };

  const handleLanguageChange = (index, field, value) => {
    const newLanguages = languages.map((lang, i) => (i === index ? { ...lang, [field]: value } : lang));
    setLanguages(newLanguages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., validation and API call
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TutorNavbar />
      <main className="flex-1 flex justify-center items-center p-4 mt-16 md:mt-24 mb-10">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Tutor Request</h1>
          <p className="text-gray-600 mb-6 text-sm md:text-base">Fill out the form to request to become a tutor</p>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="text"
              placeholder="SpeakIn Name (To avoid impersonisation)"
              required
              className={`mb-4 p-2 border rounded focus:ring-2 outline-none ${
                errorMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Full Name as in Govt ID/Certificate"
              required
              className={`mb-4 p-2 border rounded focus:ring-2 outline-none ${
                errorMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              className={`mb-4 p-2 border rounded focus:ring-2 outline-none ${
                errorMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              className={`mb-4 p-2 border rounded focus:ring-2 outline-none ${
                errorMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Country"
              required
              className={`mb-4 p-2 border rounded focus:ring-2 outline-none ${
                errorMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <div className="mb-4">
              <label className="font-medium">Languages You Teach:</label>
              <div className="flex items-center mb-2">
              {languages.map((lang, index) => (
                    <select
                    key={index}
                    className="p-2 border rounded mr-2"
                    value={lang.language}
                    onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                  >
                    <option value="" disabled>Select Language</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Mandarin">Mandarin</option>
                  </select>
              ))}
                <input
                  type="radio"
                  className="mr-2"
                  checked={isNative}
                  onChange={() => setIsNative(true)}
                />
                <span>Native</span>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  className="mr-2"
                  checked={!isNative}
                  onChange={() => setIsNative(false)}
                />
                <span>Non-Native</span>
              </div>
              {isNative ? (
                <div className="mb-4">
                  <label className="block">Government ID Image</label>
                  <input type="file" className="p-2 border rounded" />
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block">Teaching Certificate Image</label>
                  <input type="file" className="p-2 border rounded" />
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block font-medium">Languages You Can Speak:</label>
              {languages.map((lang, index) => (
                <div key={index} className="flex items-center mb-2">
                  <select
                    className="p-2 border rounded mr-2"
                    value={lang.language}
                    onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                  >
                    <option value="" disabled>Select Language</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Mandarin">Mandarin</option>
                  </select>
                  <select
                    className="p-2 border rounded mr-2"
                    value={lang.proficiency}
                    onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
                    disabled={index === 0} // Disable proficiency change for the first language
                  >
                    <option value="native">Native</option>
                    <option value="non-native">Non-Native</option>
                    <option value="fluent">Fluent</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="beginner">Beginner</option>
                  </select>
                  <button
                    type="button"
                    className="p-2 bg-red-500 text-white rounded"
                    onClick={() => handleRemoveLanguage(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="p-2 bg-blue-500 text-white rounded mt-2"
                onClick={handleAddLanguage}
              >
                Add More
              </button>
            </div>
            <div className="mb-4">
              <label className="block">About:</label>
              <textarea className="p-2 border rounded" rows="3"></textarea>
            </div>
            <div className="mb-4">
              <label className="block">Intro Video:</label>
              <input type="file" className="p-2 border rounded" />
            </div>
            <div className="mb-4">
              <label className="block">Set Hourly Rate:</label>
              <p>Set hourly rate on Credits, 1 Credit worth ₹10</p>
              <input
                type="number"
                className="p-2 border rounded mb-2"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
              <p>We use the funds for getting more students and for constant improvements of our learning platform</p>
              <p>SpeakUp Commission - 20%</p>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="p-2 bg-gray-300 rounded"
                onClick={() => navigate('/')} // Replace with the appropriate cancel action
              >
                Cancel
              </button>
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded"
              >
                Request
              </button>
            </div>
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TutorRequestPage;
