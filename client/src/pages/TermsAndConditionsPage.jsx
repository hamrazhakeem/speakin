import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Book, Users, MessageCircle } from 'lucide-react';

const TermsAndConditionsPage = () => {
  const sections = [
    {
      title: "1. Platform Overview",
      content: [
        "1.1. SpeakIn is a language learning platform that facilitates one-on-one video lessons between students and verified language tutors.",
        "1.2. The platform supports both native and certified non-native language tutors.",
        "1.3. By using our services, you agree to these terms and conditions in their entirety."
      ]
    },
    {
      title: "2. User Accounts",
      content: [
        "2.1. Users must provide accurate and complete information during registration.",
        "2.2. Users are responsible for maintaining the confidentiality of their account credentials.",
        "2.3. Users must be at least 18 years old to create an account.",
        "2.4. Users must not share their account credentials or transfer their account to others."
      ]
    },
    {
      title: "3. Tutor Verification",
      content: [
        "3.1. Native language tutors must provide valid government-issued identification for verification.",
        "3.2. Non-native tutors must provide valid language teaching certifications.",
        "3.3. Tutors can only teach one language at a time.",
        "3.4. Changes in teaching language require admin approval while continuing to teach the current language."
      ]
    },
    {
      title: "4. Video Lessons",
      content: [
        "4.1. Lessons are conducted through our secure video platform.",
        "4.2. Users must have appropriate technical requirements (stable internet, webcam, microphone).",
        "4.3. Recording of sessions is prohibited unless explicitly agreed upon by both parties.",
        "4.4. Users must maintain professional conduct during video sessions."
      ]
    },
    {
      title: "5. Privacy & Security",
      content: [
        "5.1. We implement industry-standard security measures to protect user data.",
        "5.2. Personal information is handled according to our Privacy Policy.",
        "5.3. Video sessions are private and accessible only to the registered student and tutor.",
        "5.4. Passwords are securely hashed using industry-standard encryption methods."
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
            <Shield className="w-4 h-4" />
            Terms & Conditions
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {sections.map((section, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.content.map((item, idx) => (
                      <p key={idx} className="text-gray-600 leading-relaxed">
                        {item}
                      </p>
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
            Questions about our terms?
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Clarification?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our support team is here to help you understand our terms
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

export default TermsAndConditionsPage; 