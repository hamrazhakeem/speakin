import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, Calendar, Video, MessageCircle, Star, ChevronRight, Sparkles } from 'lucide-react';

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Learn Languages the
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Natural Way</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to start your language learning journey with expert tutors
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {[
              {
                step: "01",
                title: "Find Your Perfect Tutor",
                description: "Browse through our verified tutors, filter by language, price, and availability. Read reviews from other students to make an informed choice.",
                icon: <Search className="w-6 h-6" />,
                features: [
                  "Native speakers with verified government ID",
                  "Certified non-native tutors",
                  "Detailed tutor profiles with video introductions",
                  "Real student reviews and ratings"
                ]
              },
              {
                step: "02",
                title: "Schedule Your Lessons",
                description: "Book lessons at times that work for you. Our tutors are available 24/7 across different time zones.",
                icon: <Calendar className="w-6 h-6" />,
                features: [
                  "Flexible scheduling system",
                  "24/7 availability",
                  "Instant booking confirmation",
                  "Easy rescheduling options"
                ]
              },
              {
                step: "03",
                title: "Start Learning",
                description: "Connect with your tutor via video chat for personalized 1-on-1 lessons tailored to your goals.",
                icon: <Video className="w-6 h-6" />,
                features: [
                  "High-quality video chat platform",
                  "Interactive learning tools",
                  "Customized lesson plans",
                  "Progress tracking"
                ]
              }
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className={`space-y-6 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold">
                        {step.step}
                      </div>
                      <div className="p-2 bg-blue-50 rounded-lg">
                        {step.icon}
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{step.title}</h2>
                    <p className="text-lg text-gray-600">{step.description}</p>
                    <ul className="space-y-3">
                      {step.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-gray-600">
                          <Sparkles className="w-5 h-5 text-blue-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-50 transition duration-200"></div>
                      <div className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center">
                        {step.icon}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Everything You Need to Succeed
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageCircle className="w-6 h-6" />,
                title: "Chat with Tutors",
                description: "Message your tutors anytime for quick questions or lesson coordination"
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "Track Progress",
                description: "Monitor your improvement with detailed progress tracking and feedback"
              },
              {
                icon: <Video className="w-6 h-6" />,
                title: "HD Video Lessons",
                description: "Crystal clear video chat for an immersive learning experience"
              }
            ].map((feature, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-5 group-hover:opacity-10 transition duration-200"></div>
                <div className="relative p-6 bg-white rounded-xl border border-gray-100">
                  <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-600 relative overflow-hidden">
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
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center mx-auto group"
            >
              Get Started Now
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks; 