import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LanguagePreferences = () => {
    const [languagesSpoken, setLanguagesSpoken] = useState(['Hindi']); // Initialize with default language
    const [country, setCountry] = useState('India'); // Set a default country
    const [languageToLearn, setLanguageToLearn] = useState('Spanish'); // Set a default language to learn
    const [proficiency, setProficiency] = useState('A2'); // Set a default proficiency level

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Successfully submitted')
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex justify-center items-center p-4 mt-16 md:mt-24 mb-10">
                <div className="w-full max-w-md p-6 bg-white rounded" style={{boxShadow:"0 4px 15px rgba(0, 0, 0, 0.2)"}}> {/* Added shadow-lg */}
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Tell Us About Your Language Preferences</h2>
                    <p className="text-gray-600 mb-6 text-center text-sm md:text-base">
                        This will help us tailor your learning experience.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col">
                            <label htmlFor="languages" className="text-left text-sm font-medium">Languages You Can Speak</label>
                            <select
                                id="languages"
                                value={languagesSpoken[0]}
                                onChange={(e) => setLanguagesSpoken([e.target.value])} // Update state as needed
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="Hindi">Hindi</option>
                                {/* Add other languages as options */}
                            </select>
                            <button type="button" className="text-blue-500 text-sm mt-1">+ Add more</button>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="country" className="text-left text-sm font-medium">Country</label>
                            <select
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="India">India</option>
                                {/* Add more country options */}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="language-to-learn" className="text-left text-sm font-medium">Language to Learn</label>
                            <select
                                id="language-to-learn"
                                value={languageToLearn}
                                onChange={(e) => setLanguageToLearn(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="Spanish">Spanish</option>
                                {/* Add more languages to learn */}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="proficiency" className="text-left text-sm font-medium">Proficiency</label>
                            <select
                                id="proficiency"
                                value={proficiency}
                                onChange={(e) => setProficiency(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="A2">A2</option>
                                {/* Add more proficiency levels */}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LanguagePreferences;
