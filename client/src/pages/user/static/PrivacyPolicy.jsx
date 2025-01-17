import React from 'react';
import Navbar from '../../../components/user/common/Navbar';
import Footer from '../../../components/user/common/Footer';
import { Lock, MessageCircle } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      content: [
        {
          subtitle: "1.1. Account Information",
          details: [
            "Full name and email address for account creation",
            "Password (securely hashed using industry-standard encryption)",
            "Profile picture (optional)",
            "Contact information"
          ]
        },
        {
          subtitle: "1.2. Tutor Verification Data",
          details: [
            "Government-issued ID for native speakers",
            "Language teaching certifications for non-native tutors",
            "Educational qualifications and teaching experience"
          ]
        },
        {
          subtitle: "1.3. Technical Data",
          details: [
            "Device information and browser type",
            "IP address and connection data",
            "Video chat session metadata (time, duration, participants)"
          ]
        }
      ]
    },
    {
      title: "2. How We Use Your Information",
      content: [
        {
          subtitle: "2.1. Core Service Functionality",
          details: [
            "Facilitating video lessons between students and tutors",
            "Processing tutor verification and language change requests",
            "Managing user accounts and profiles",
            "Enabling secure video chat sessions"
          ]
        },
        {
          subtitle: "2.2. Security and Protection",
          details: [
            "Verifying user identities",
            "Protecting against unauthorized access",
            "Maintaining platform security",
            "Detecting and preventing fraud"
          ]
        }
      ]
    },
    {
      title: "3. Data Protection",
      content: [
        {
          subtitle: "3.1. Security Measures",
          details: [
            "Implementation of secure password hashing",
            "Secure SSL/TLS encryption for data transmission",
            "Regular security audits and updates",
            "Restricted access to personal information"
          ]
        },
        {
          subtitle: "3.2. Video Session Privacy",
          details: [
            "Private, encrypted video sessions",
            "Access limited to registered participants",
            "No unauthorized recording of sessions",
            "Secure transmission of video data"
          ]
        }
      ]
    },
    {
      title: "4. Your Rights",
      content: [
        {
          subtitle: "4.1. Access and Control",
          details: [
            "Right to access your personal data",
            "Right to update or correct your information",
            "Right to delete your account and associated data",
            "Right to request data portability"
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e510_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-sm font-medium mb-8">
            <Lock className="w-4 h-4" />
            Privacy Policy
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Privacy Matters
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {sections.map((section, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {section.title}
                  </h2>
                  <div className="space-y-8">
                    {section.content.map((subsection, idx) => (
                      <div key={idx} className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {subsection.subtitle}
                        </h3>
                        <ul className="space-y-2">
                          {subsection.details.map((detail, detailIdx) => (
                            <li key={detailIdx} className="text-gray-600 leading-relaxed flex items-start">
                              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 mr-3"></div>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-8">
            <MessageCircle className="w-4 h-4" />
            Questions about privacy?
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Privacy Concerns?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact our privacy team for any questions or concerns
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform">
            Contact Support
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy; 