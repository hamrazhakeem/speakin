import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Globe, Users, Shield, Award, ChevronRight, Check, Star, Video, MessageCircle, Sparkles } from 'lucide-react';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
  
      {/* Hero Section with Abstract Background */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Trusted by 25k+ Students
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transforming Language Learning Through
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Human Connection</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're on a mission to make language learning more personal, effective, and enjoyable through real conversations with expert tutors.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section with Modern Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '20+', label: 'Countries', icon: <Globe className="w-5 h-5 text-blue-600" /> },
              { number: '5000+', label: 'Expert Tutors', icon: <Users className="w-5 h-5 text-blue-600" /> },
              { number: '25k+', label: 'Active Students', icon: <Star className="w-5 h-5 text-blue-600" /> },
              { number: '100k+', label: 'Lessons Completed', icon: <Video className="w-5 h-5 text-blue-600" /> },
            ].map((stat, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-5 group-hover:opacity-10 transition duration-200"></div>
                <div className="relative bg-white p-6 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-4 mb-2">
                    {stat.icon}
                    <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section with Gradient Border */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative group rounded-2xl p-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-white">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-10 blur-xl"></div>
            <div className="relative">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  {[
                    "Connect language learners with verified native speakers and certified tutors",
                    "Provide personalized learning experiences through video chat",
                    "Make language learning accessible and affordable",
                    "Foster cultural exchange and understanding"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-1 bg-blue-100 rounded-full">
                        <Check className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-gray-600">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Why Choose Us?</h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Verified Tutors",
                        description: "All tutors are verified through government ID or language certificates"
                      },
                      {
                        title: "Flexible Learning",
                        description: "Schedule lessons at your convenience, 24/7"
                      },
                      {
                        title: "Quality Assurance",
                        description: "Regular quality checks and student feedback system"
                      }
                    ].map((item, index) => (
                      <div key={index} className="p-4 bg-white rounded-xl shadow-sm">
                        <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section with Modern Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-blue-600" />,
                title: "Trust & Safety",
                description: "We verify all tutors and ensure a safe learning environment for our community."
              },
              {
                icon: <Sparkles className="w-8 h-8 text-blue-600" />,
                title: "Excellence",
                description: "We maintain high standards for our tutors and learning experience."
              },
              {
                icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
                title: "Communication",
                description: "We believe in clear, open communication and continuous feedback."
              }
            ].map((value, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-5 group-hover:opacity-10 transition duration-200"></div>
                <div className="relative p-6 bg-white rounded-xl border border-gray-100 hover:border-blue-100 transition-all duration-200">
                  <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4 group-hover:bg-blue-100 transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Enhanced Design */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Language Learning Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students already learning with SpeakIn
            </p>
            <button 
              onClick={() => navigate('/sign-up')}
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center mx-auto group"
            >
              Get Started
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs; 