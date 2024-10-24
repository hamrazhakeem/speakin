import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import useAxios from '../hooks/useAxios';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Navigate, useNavigate } from 'react-router-dom';

const languagesList = [
  'English', 'Spanish', 'French', 'German', 'Mandarin', 'Italian', 
];

const ProfilePage = () => {
  const [userData, setUserData] = useState();
  const [name, setName] = useState('');
  const [languagesSpoken, setLanguagesSpoken] = useState([]);
  const [languagesToLearn, setLanguagesToLearn] = useState([]);
  const [image, setImage] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [country, setCountry] = useState('');
  const [proficiency, setProficiency] = useState('');
  const userId = useSelector((state) => state.auth.userId);
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`get_user/${userId}/`);
        if (response.data) {
          setUserData(response.data);
          setName(response.data.name);
          setCountry(response.data.country)
          setLanguagesSpoken(response.data.languagesSpoken || []);
          setLanguagesToLearn(response.data.languagesToLearn || []);
          
          // Use response.data.profile_image directly here
          console.log("Fetched user data:", response.data);
          console.log(response.data.profile_image);
        
          setImage(response.data.profile_image);
        }
         else{
          console.error('No user data found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleLanguageDelete = (lang, type) => {
    if (type === 'spoken') {
      setLanguagesSpoken(languagesSpoken.filter((l) => l !== lang));
    } else {
      setLanguagesToLearn(languagesToLearn.filter((l) => l !== lang));
    }
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('country', country);

    if (image && image.size > 0) {
        console.log("Appending image to FormData:", image);
        formData.append('profile_image', image);
    } else {
        alert('Please select a valid image file.');
        return;
    }

    languagesSpoken.forEach(lang => {
        formData.append('languagesSpoken[]', lang);
    });

    languagesToLearn.forEach(lang => {
        formData.append('languagesToLearn[]', lang);
    });

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
        await axiosInstance.put(`update_user/${userId}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        alert('Profile updated successfully');
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile: ' + error.message);
    }
};

  const handleAddLanguage = () => {
    if (newLanguage && proficiency) {
      setLanguagesToLearn([...languagesToLearn, `${newLanguage} (${proficiency})`]);
      setNewLanguage('');
      setProficiency('');
    } else {
      alert('Please select a language and proficiency');
    }
  };

  const handleLanguageEdit = (index, lang, type) => {
    const editedLang = prompt('Edit language:', lang);
    if (editedLang) {
      if (type === 'spoken') {
        const updatedSpoken = [...languagesSpoken];
        updatedSpoken[index] = editedLang;
        setLanguagesSpoken(updatedSpoken);
      } else {
        const updatedLearn = [...languagesToLearn];
        updatedLearn[index] = editedLang;
        setLanguagesToLearn(updatedLearn);
      }
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-white-100">
        <div className="container mx-auto p-4 mt-16 md:mt-24 mb-10">
          <h1 className="text-2xl font-bold mb-6">Account & Settings</h1>
          <div className="flex flex-col md:flex-row">
            {/* Left Sidebar */}
            <div className="w-full md:w-1/4 pr-0 md:pr-4 mb-4 md:mb-0">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 rounded-t-lg">Account Settings</div>
                <button className="p-4 rounded-t-lg hover:bg-gray-200" onClick={()=> navigate('change-password')}>Change Password</button>
                <div className="p-4 rounded-t-lg">Bookings</div>
                <div className="p-4 rounded-t-lg">Refer a Friend</div>
                <div className="p-4 rounded-t-lg">Delete Account</div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  {userData.profile_image && (
                    <img 
                      src={`${userData.profile_image}`} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-blue-500 text-sm ml-2" />
              </div>

              <form>
                {/* Name input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={userData.name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                {/* Email input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={userData.email}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-200"
                  />
                </div>

                {/* Country input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    value={userData.country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                {/* Languages you can speak */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Languages you can speak</label>
                  {languagesSpoken.length === 0 ? (
                    <p className="text-gray-500">Languages empty. Click + Add more</p>
                  ) : (
                    languagesSpoken.map((lang, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={lang}
                          onChange={(e) => handleLanguageEdit(index, e.target.value, 'spoken')}
                          className="border rounded p-2 mr-2 w-1/2"
                        />
                        <button type="button" onClick={() => handleLanguageDelete(lang, 'spoken')} className="text-red-500">Delete</button>
                      </div>
                    ))
                  )}
                  <button type="button" onClick={() => handleAddLanguage()} className="text-blue-500 text-sm mt-1">+ Add more</button>
                </div>

                {/* Languages to learn */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Languages to learn</label>
                  {languagesToLearn.length === 0 ? (
                    <p className="text-gray-500">Languages empty. Add below:</p>
                  ) : (
                    languagesToLearn.map((lang, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={lang}
                          onChange={(e) => handleLanguageEdit(index, e.target.value, 'learn')}
                          className="border rounded p-2 mr-2 w-1/2"
                        />
                        <button type="button" onClick={() => handleLanguageDelete(lang, 'learn')} className="text-red-500">Delete</button>
                      </div>
                    ))
                  )}
                  <div className="flex items-center mb-2">
                    <select
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      className="w-1/2 p-2 border rounded mr-2"
                    >
                      <option value="">Select a language</option>
                      {languagesList.map((lang, index) => (
                        <option key={index} value={lang}>{lang}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={proficiency}
                      onChange={(e) => setProficiency(e.target.value)}
                      placeholder="Proficiency"
                      className="w-1/2 p-2 border rounded"
                    />
                    <button type="button" onClick={handleAddLanguage} className="text-blue-500 ml-2">Add</button>
                  </div>
                </div>

                <button type="button" onClick={handleSaveChanges} className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
