import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <div >

      <Navbar />

    <div className='p-8'>
      <section className="hero bg-white text-center py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-4">
            <img 
              src="/src/assets/hero-image.webp" 
              alt="Hero Image" 
              className="full w-full max-w-md md:max-w-lg lg:max-w-xl object-cover" 
            />
          </div>
          <h1 className="text-4xl font-bold mt-8">Learn languages effortlessly with expert 1-on-1 tutoring.</h1>
          <p className="text-lg text-gray-600 mt-4">Start today and explore new languages!</p>
          <button className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg">Get Started</button>
        </div>
      </section>

      <section className="how-it-works bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8">How SpeakIn Works:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-bold">1. Buy Credits</h3>
              <p className="text-gray-600 mt-2">Each Tutor May require credits accordingly.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold">2. Find Your Tutor</h3>
              <p className="text-gray-600 mt-2">Explore profiles of tutors with different skills and languages.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold">3. Start Learning</h3>
              <p className="text-gray-600 mt-2">Book your session, begin learning 1-on-1.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8">Now with SpeakIn+, you get even more.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border rounded-lg p-8 text-left">
              <h3 className="text-2xl font-bold">Free</h3>
              <p className="text-4xl font-bold mt-4">₹0</p>
              <ul className="text-gray-600 mt-4 list-disc pl-5">
                <li>1-on-1 trial with Tutors</li>
                <li>Chat with Tutors</li>
                <li>Earn credits by referring friends</li>
              </ul>
            </div>
            <div className="border rounded-lg p-8 text-left">
              <h3 className="text-2xl font-bold">SpeakIn+</h3>
              <p className="text-4xl font-bold mt-4">₹149 for 6 months</p>
              <ul className="text-gray-600 mt-4 list-disc pl-5">
                <li>All features from Free plan</li>
                <li>Priority booking for popular Tutors</li>
                <li>Faster Customer Care support</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <section className="become-a-tutor bg-gray-100 py-16 mb-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-4">Become a tutor</h2>
          <p className="text-lg text-gray-600 mb-8">Earn money by sharing your language expertise.</p>
          <button className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg">Sign Up</button>
        </div>
      </section>
      </div>
      
      <Footer />

    </div>
  )
}

export default LandingPage