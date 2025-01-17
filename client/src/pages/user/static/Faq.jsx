import React, { useState } from 'react';
import { Search, MessageCircle, Book, Settings, Users } from 'lucide-react';
import Navbar from '../../../components/user/common/Navbar';
import Footer from '../../../components/user/common/Footer';
import FaqItem from '../../../components/user/common/FaqItem';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('For Students');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'students', label: 'For Students', icon: Book },
    { id: 'tutors', label: 'For Tutors', icon: Users },
    { id: 'technical', label: 'Technical & Security', icon: Settings },
  ];

  const faqCategories = [
    {
      category: "For Students",
      questions: [
        {
          q: "How do I get started with language learning on SpeakIn?",
          a: "Getting started is easy! First, create an account and complete your profile. Choose your target language and browse through our verified tutors. You can filter tutors by native speakers, certified teachers, and their availability. Book a 1-on-1 video session with your chosen tutor to begin your learning journey."
        },
        {
          q: "What's the difference between native and non-native tutors?",
          a: "Native tutors are verified through government ID verification, while non-native tutors are verified through their language teaching certifications. Both types of tutors undergo a thorough verification process to ensure quality teaching."
        },
        {
          q: "How do the video lessons work?",
          a: "Lessons are conducted through our secure video chat platform. You'll have a 1-on-1 session with your tutor where you can practice speaking and learning your target language. The platform includes features for real-time interaction and learning."
        },
        {
          q: "How do I book a lesson?",
          a: "You can browse tutor profiles, check their availability, and book a time slot that works for you. Once booked, you'll receive confirmation and instructions for joining the video session."
        },
        {
          q: "How do I purchase credits on SpeakIn?",
          a: "You can purchase credits securely through our Stripe payment system. Click on 'Buy' on Navbar, enter your desired amount of credits, and complete the purchase using your preferred payment method. We accept all major credit/debit cards and support various local payment methods depending on your region. If you wish to withdraw unused credits, ensure your Stripe Connect account is set up."
        },
        {
          q: "Are my payment details secure?",
          a: "Absolutely! We partner with Stripe, a global leader in online payments, to ensure your payment information is always secure. Your card details are never stored on our servers and all transactions are encrypted using industry-standard security protocols."
        },
      ]
    },
    {
      category: "For Tutors",
      questions: [
        {
          q: "What are the requirements to become a tutor?",
          a: "Native speakers must provide government-issued ID for verification. Non-native speakers need valid language teaching certifications that prove their expertise in the language they wish to teach. All tutors must have a reliable internet connection and equipment for video lessons."
        },
        {
          q: "How does the verification process work?",
          a: "After submitting your application, our admin team reviews your credentials. Native speakers undergo ID verification, while non-native speakers have their language certifications validated. Once verified, you can start accepting students."
        },
        {
          q: "Can I teach multiple languages?",
          a: "Currently, tutors can only teach one language at a time. If you want to change your teaching language, you need to submit a request through your dashboard. While your request is being reviewed, you can continue teaching your current language. The new language will be available for teaching only after admin approval."
        },
        {
          q: "How do I request a change in teaching language?",
          a: "Go to your tutor dashboard and select 'Edit Teaching Language'. Submit your new language certification (for non-native speakers) or updated documentation. Continue teaching your current language while the admin reviews your request. You'll be notified once your request is approved."
        },
        {
          q: "How do I manage my teaching schedule?",
          a: "You have full control over your availability through your tutor dashboard. You can set your available hours and manage your upcoming sessions."
        },
        {
          q: "How do I withdraw my earnings from SpeakIn?",
          a: "To withdraw your earnings, you'll need to set up a Stripe Connect account, which allows for secure and direct payments to your bank account. You can initiate withdrawals from your withdrawal page by clicking 'Connect with Stripe' and completing the Stripe setup process. Once connected, you can withdraw earnings above 10 credits by entering the desired amount, and with a single tap, your funds will be transferred to your bank account."
        },
        {
          q: "What are the minimum credits required for withdrawal?",
          a: "Tutors must have a minimum of above 10 credits to initiate a withdrawal. Credits earned through sessions are converted to your local currency before transfer."
        },
      ]
    },
    {
      category: "Technical & Security",
      questions: [
        {
          q: "Is my personal information secure?",
          a: "Yes, we implement strong security measures to protect your data. We use industry-standard secure authentication methods and follow best practices for data protection."
        },
        {
          q: "What do I need for video lessons?",
          a: "You need a stable internet connection, a working webcam, and a microphone. Our platform works through modern web browsers, and we recommend using a computer or laptop for the best experience."
        },
        {
          q: "How secure are the video sessions?",
          a: "All video sessions are private and can only be accessed by the registered student and tutor. We prioritize the security and privacy of our users during lessons."
        },
        {
          q: "How do I set up Stripe Connect?",
          a: "Both students (for withdrawing unused credits) and tutors (for withdrawing earned credits) need to set up Stripe Connect. Go to the withdrawal page, click 'Connect with Stripe,' and follow the Stripe onboarding process. Once connected, you can securely add your bank account and enable fast withdrawals with just one tap."
        },
        {
          q: "How does SpeakIn handle payment security?",
          a: "SpeakIn uses Stripe's secure payment infrastructure to handle all transactions. Stripe is PCI-DSS Level 1 certified (the highest level of certification available) and uses advanced encryption to protect your payment information. We never store your card details on our servers."
        },
        {
          q: "What happens if there's an issue with my payment or withdrawal?",
          a: "Our system automatically monitors all transactions. If you experience any payment or withdrawal issues, our support team works directly with Stripe to resolve them quickly. You can track all your transactions in real-time through your dashboard."
        },
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
            <MessageCircle className="w-4 h-4" />
            Get Quick Answers
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Everything you need to know about our language learning platform
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Type your question here..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-full font-medium
                    transition-all duration-200 
                    ${activeCategory === cat.label 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* FAQ Items */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            {faqCategories
              .find(cat => cat.category === activeCategory)?.questions
              .filter(item => 
                item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.a.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item, index) => (
                <FaqItem
                  key={index}
                  question={item.q}
                  answer={item.a}
                  isActive={activeIndex === index}
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                />
              ))
            }
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            24/7 Support Available
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our support team is here to help you anytime
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

export default Faq;