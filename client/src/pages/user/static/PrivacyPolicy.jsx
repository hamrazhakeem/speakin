import React from 'react';
import Layout from '../../../components/user/layout/Layout';
import { Lock, MessageCircle, ChevronRight, ArrowRight, Shield } from 'lucide-react';

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
    <Layout>
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
        <div className="relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium mb-8 hover:bg-white/20 transition-colors cursor-pointer group">
                <Lock className="w-4 h-4" />
                Last Updated: {new Date().toLocaleDateString()}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Your Privacy Matters
              </h1>
              <p className="text-xl text-blue-50 max-w-2xl mx-auto">
                We take your privacy seriously. Learn how we protect your data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 text-sm font-bold">
                    {index + 1}
                  </div>
                  {section.title.substring(2)}
                </h2>
                <div className="space-y-8">
                  {section.content.map((subsection, idx) => (
                    <div key={idx} className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        {subsection.subtitle.substring(4)}
                      </h3>
                      <ul className="space-y-3">
                        {subsection.details.map((detail, detailIdx) => (
                          <li key={detailIdx} className="flex items-start gap-3 group">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2.5"></div>
                            <p className="text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                              {detail}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium mb-8">
              <MessageCircle className="w-4 h-4" />
              Questions about privacy?
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Privacy Concerns?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Contact our privacy team for any questions or concerns
            </p>
            <button className="group px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 mx-auto">
              Contact Support
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;