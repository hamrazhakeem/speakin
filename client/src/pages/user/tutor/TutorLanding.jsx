import React from 'react';
import Navbar from '../../../components/user/common/Navbar';
import Footer from '../../../components/user/common/Footer';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Shield, Calendar, Award } from 'lucide-react';

const TutorLanding = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-sm font-medium group cursor-pointer hover:bg-blue-100 transition-colors mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Join 5000+ Expert Tutors Worldwide
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-6">
            Transform Lives Through
            <span className="block mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight pb-2">
              Language Teaching
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Share your language expertise and connect with students globally. 
            Teach on your schedule, from anywhere in the world.
          </p>

          {/* Stats Row */}
          <div className="flex justify-center gap-8 mb-12">
            {[
              { label: 'Active Students', value: '25,000+' },
              { label: 'Countries', value: '20+' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => navigate('/tutor/sign-in')}
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center group shadow-lg shadow-blue-500/25"
            >
              Start Teaching
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/how-it-works')}
              className="px-8 py-4 bg-white text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center group border border-gray-200"
            >
              Learn More
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Teach with SpeakIn?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our community of passionate educators making a global impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-blue-600" />,
                title: "Supportive Community",
                description: "Connect with fellow educators and share teaching experiences in our vibrant community"
              },
              {
                icon: <Calendar className="w-8 h-8 text-blue-600" />,
                title: "Flexible Schedule",
                description: "Design your teaching schedule around your lifestyle with our easy-to-use platform"
              },
              {
                icon: <Award className="w-8 h-8 text-blue-600" />,
                title: "Professional Growth",
                description: "Access exclusive teaching resources and development opportunities"
              }
            ].map((benefit, index) => (
              <div key={index} 
                className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200"
              >
                <div className="p-3 bg-blue-50 rounded-2xl w-fit mb-6 group-hover:bg-blue-100 transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What You Need to Get Started</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet our basic requirements and start teaching in no time
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "For Native Speakers",
                requirements: [
                  "Government-issued ID",
                  "Stable internet connection",
                  "Webcam for video lessons",
                  "Teaching experience (preferred)",
                  "Professional profile photo"
                ]
              },
              {
                title: "For Certified Teachers",
                requirements: [
                  "Language teaching certification",
                  "Proof of language proficiency",
                  "Stable internet connection",
                  "Webcam for video lessons",
                  "Professional profile photo"
                ]
              }
            ].map((category, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">{category.title}</h3>
                <ul className="space-y-4">
                  {category.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <ChevronRight className="w-5 h-5 text-blue-600 mr-2" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Start Your Teaching Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of expert tutors and start impacting lives globally
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/tutor/verify-email')}
                  className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg flex items-center justify-center group"
                >
                Apply Now
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TutorLanding;
