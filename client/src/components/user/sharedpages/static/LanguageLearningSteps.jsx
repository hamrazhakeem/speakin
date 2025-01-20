import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Video, MessageCircle, Star, ChevronRight, ArrowRight } from 'lucide-react';

const LanguageLearningSteps = () => {
    const navigate = useNavigate();

    return (
        <div>
            {/* Hero Section */}
            <section className="pt-20 pb-16 bg-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
          <div className="relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium mb-8 hover:bg-white/20 transition-colors cursor-pointer group">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  Simple Steps to Fluency
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                  Your Path to Language
                  <span className="relative inline-block ml-3">
                    <span className="relative text-blue-100">Mastery</span>
                  </span>
                </h1>
                <p className="text-xl text-blue-50 leading-relaxed">
                  Follow these simple steps to embark on your language learning journey with expert tutors who guide you every step of the way
                </p>
              </div>
            </div>
          </div>
        </section>
  
        {/* Steps Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: <Search className="w-6 h-6" />,
                  title: "Find Your Tutor",
                  description: "Browse through our verified tutors, filter by language, and read reviews to find your perfect match.",
                  step: "01"
                },
                {
                  icon: <Calendar className="w-6 h-6" />,
                  title: "Schedule Lessons",
                  description: "Book lessons at times that work for you with our flexible scheduling system.",
                  step: "02"
                },
                {
                  icon: <Video className="w-6 h-6" />,
                  title: "Start Learning",
                  description: "Connect via video chat for personalized 1-on-1 lessons tailored to your goals.",
                  step: "03"
                }
              ].map((item, index) => (
                <div key={index} className="relative group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-bold">
                      {item.step}
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
  
        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
              <p className="text-gray-600">Our platform provides all the essential tools for effective learning</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <MessageCircle className="w-6 h-6" />,
                  title: "Chat Support",
                  description: "Message tutors anytime for quick help"
                },
                {
                  icon: <Star className="w-6 h-6" />,
                  title: "Track Progress",
                  description: "Monitor your improvement over time"
                },
                {
                  icon: <Video className="w-6 h-6" />,
                  title: "HD Video",
                  description: "Crystal clear video chat experience"
                }
              ].map((feature, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-blue-50 rounded-lg w-fit mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
  
        {/* CTA Section */}
        <section className="py-20 bg-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of successful language learners today
              </p>
              <button 
                onClick={() => navigate('/sign-up')}
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 mx-auto"
              >
                Get Started Now
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
        </div>
    );
  };

export default LanguageLearningSteps