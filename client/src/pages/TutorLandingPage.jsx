import React from 'react';
import TutorNavbar from '../components/TutorNavbar';
import Footer from '../components/Footer';

const TutorLandingPage = () => {
  return (
    <div>
      <TutorNavbar />
      <div className='p-8'>
        <section className="hero bg-white text-center py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mt-4">Make a living by teaching the largest community of learners worldwide</h1>
            <div className="flex justify-center items-center space-x-4 mt-8">
              <img 
                src="/src/assets/tutor-hero-image.webp" 
                alt="Smiling tutor" 
                className="w-full max-w-md md:max-w-lg lg:max-w-xl rounded-full object-cover"
              />
            </div>
            <p className="text-lg text-gray-600 mt-10">Start your journey as a tutor today!</p>
            
            
            
          </div>
        </section>

        <section className="how-it-works py-12 rounded mb-10" style={{ backgroundColor: '#FF2D55' }}>
            <div className="container mx-auto px-4">
                <h2 className="text-3xl text-white font-semibold text-center mb-8">How it works:</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 rounded-lg">
                    <h3 className="text-xl text-white font-bold">1. Sign Up</h3>
                    <p className="text-white mt-2">Create your tutor profile and get started.</p>
                </div>
                <div className="text-center p-6 rounded-lg">
                    <h3 className="text-xl text-white font-bold">2. Get Approved</h3>
                    <p className="text-white mt-2">Our team reviews your profile within 3 business days.</p>
                </div>
                <div className="text-center p-6 rounded-lg">
                    <h3 className="text-xl text-white font-bold">3. Start Earning</h3>
                    <p className="text-white mt-2">Teach students and earn money from anywhere.</p>
                </div>
                </div>
                {/* Center the button below the grid */}
                <div className="flex justify-center mt-10">
                <button className="bg-blue-500 text-white px-6 py-3 rounded-lg transition duration-300 hover:bg-blue-600">
                    Give request to become tutor now
                </button>
                </div>
            </div>
            </section>

      </div>
      <Footer />
    </div>
  );
};

export default TutorLandingPage;
