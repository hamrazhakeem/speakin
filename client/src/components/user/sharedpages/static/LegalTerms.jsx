import React from 'react';
import { Shield, MessageCircle, ChevronRight, ArrowRight } from 'lucide-react';
import { HeroSection, LegalContentSection, CTASection, ContactButton } from './PageSection';
import TrustBadge from '../../common/ui/landing/TrustBadge';
import LandingButton from '../../common/ui/buttons/LandingButton';

const LegalTerms = () => {
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
        <div>
          <HeroSection
            badge={<TrustBadge text={`Last Updated: ${new Date().toLocaleDateString()}`} />}
            icon={Shield}
            title="Terms of Service"
            description="Please read these terms carefully before using our platform"
          />
    
          <LegalContentSection sections={sections} />
    
          <CTASection
            badge="Questions about our terms?"
            title="Need Clarification?"
            description="Our support team is here to help you understand our terms"
          >
            <ContactButton
              variant="white"
            > 
              Contact Support
            </ContactButton>
          </CTASection>
        </div>
      );
    };

export default LegalTerms