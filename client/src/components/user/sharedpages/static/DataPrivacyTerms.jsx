import React from 'react';
import { Lock, ChevronRight, Shield } from 'lucide-react';
import { HeroSection, ContentSection, CTASection, ContactButton } from './PageSection';
import TrustBadge from '../../common/ui/landing/TrustBadge';

const DataPrivacyTerms = () => {
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
        <div>
          <HeroSection
            badge={<TrustBadge text={`Last Updated: ${new Date().toLocaleDateString()}`} />}
            icon={Lock}
            title="Your Privacy Matters"
            description="We take your privacy seriously. Learn how we protect your data."
          />
    
          <ContentSection maxWidth="4xl">
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
          </ContentSection>
    
          <CTASection
            badge="Questions about privacy?"
            title="Privacy Concerns?"
            description="Contact our privacy team for any questions or concerns"
          >
            <ContactButton>
              Contact Support
            </ContactButton>
          </CTASection>
        </div>
      );
    };

export default DataPrivacyTerms