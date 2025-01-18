import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/user/layout/Layout';
import { Globe, Users, Shield, ChevronRight, Check, Star, Video, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium mb-8 hover:bg-white/20 transition-colors cursor-pointer group">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                Trusted by 25k+ Students
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                Bridging Cultures Through
                <span className="relative inline-block">
                  <span className="relative text-blue-100"> Language Learning</span>
                </span>
              </h1>
              <p className="text-xl text-blue-50 leading-relaxed">
                Founded with a vision to make language learning accessible to everyone, SpeakIn connects passionate learners with expert tutors worldwide. We believe that understanding a language opens doors to new cultures, perspectives, and opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '20+', label: 'Countries', icon: <Globe className="w-5 h-5 text-blue-600" /> },
              { number: '5000+', label: 'Expert Tutors', icon: <Users className="w-5 h-5 text-blue-600" /> },
              { number: '25k+', label: 'Active Students', icon: <Star className="w-5 h-5 text-blue-600" /> },
              { number: '100k+', label: 'Lessons Completed', icon: <Video className="w-5 h-5 text-blue-600" /> },
            ].map((stat, index) => (
              <div key={index} className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-200">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow hover:shadow-lg">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{stat.number}</div>
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px)] bg-[size:14px_14px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 md:p-12 shadow-lg">
            <div className="relative">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 flex items-center">
                Our Mission
                <div className="ml-6 h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent"></div>
              </h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  {[
                    "Connect language learners with verified native speakers and certified tutors",
                    "Provide personalized learning experiences through video chat",
                    "Make language learning accessible and affordable",
                    "Foster cultural exchange and understanding"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 group/item transform hover:translate-x-1 transition-all duration-200">
                      <div className="flex-shrink-0 p-1.5 bg-blue-50 rounded-full group-hover/item:bg-blue-100 transition-colors shadow-sm">
                        <Check className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-gray-600 group-hover/item:text-gray-900 transition-colors">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-8">
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
                      <div key={index} className="group/card cursor-pointer">
                        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md hover:bg-blue-50/50 transition-all duration-200">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-1 h-8 bg-blue-600/20 rounded-full group-hover/card:h-12 transition-all"></div>
                            <h4 className="font-medium text-gray-900 group-hover/card:text-blue-600 transition-colors">{item.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 ml-4">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Our Core Values</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            The principles that guide us in creating the best language learning experience
          </p>
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
              <div key={index} className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-200">
                <div className="h-full p-8 bg-white rounded-xl border border-gray-200 shadow hover:shadow-lg">
                  <div className="p-3 bg-blue-50 rounded-lg w-fit mb-6 group-hover:bg-blue-100 transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Language Learning Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              Join thousands of students already learning with SpeakIn
            </p>
            <button 
              onClick={() => navigate('/sign-up')}
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 mx-auto group shadow-lg hover:shadow-xl"
            >
              Get Started
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;