import React from 'react';
import Layout from '../../../components/user/layout/Layout';
import { Shield, MessageCircle, ChevronRight, ArrowRight } from 'lucide-react';

const TermsAndConditions = () => {
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
    <Layout>
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
        <div className="relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium mb-8 hover:bg-white/20 transition-colors cursor-pointer group">
                <Shield className="w-4 h-4" />
                Last Updated: {new Date().toLocaleDateString()}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Terms of Service
              </h1>
              <p className="text-xl text-blue-50 max-w-2xl mx-auto">
                Please read these terms carefully before using our platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
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
                <div className="space-y-4">
                  {section.content.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2.5"></div>
                      <p className="text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                        {item.substring(4)}
                      </p>
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
              Questions about our terms?
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Clarification?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Our support team is here to help you understand our terms
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

export default TermsAndConditions;