import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe, Video, Star, MessageCircle, Shield, Lock } from 'lucide-react'
import TrustBadge from '../../common/ui/landing/TrustBadge'
import LandingButton from '../../common/ui/buttons/LandingButton'
import BenefitCard from '../../common/ui/landing/BenefitCard'
import LanguageCard from './LanguageCard'
import stripePartner from '../../../../assets/powered-by-stripe.webp'

const LandingContent = () => {
  const navigate = useNavigate();
  
  const benefits = [
    {
      icon: Globe,
      title: "Verified Native Speakers",
      description: "Learn from tutors verified with government ID for authentic language experience"
    },
    {
      icon: Video,
      title: "1-on-1 Video Sessions",
      description: "Personalized video lessons tailored to your learning goals and schedule"
    },
    {
      icon: MessageCircle,
      title: "Chat with Tutors",
      description: "Direct messaging with tutors for questions, scheduling, and learning support"
    }
  ];

  const languages = [
    {
      language: "English",
      icon: "🇬🇧",
      learners: "8.5k+ learners",
      percentage: "34%",
      color: "bg-blue-50 hover:bg-blue-100"
    },
    {
      language: "Mandarin",
      icon: "🇨🇳",
      learners: "5k+ learners",
      percentage: "20%",
      color: "bg-orange-50 hover:bg-orange-100"
    },
    {
      language: "Hindi",
      icon: "🇮🇳",
      learners: "4k+ learners",
      percentage: "16%",
      color: "bg-purple-50 hover:bg-purple-100"
    },
    {
      language: "Spanish",
      icon: "🇪🇸",
      learners: "3.5k+ learners",
      percentage: "14%",
      color: "bg-yellow-50 hover:bg-yellow-100"
    },
    {
      language: "Arabic",
      icon: "🇦🇪",
      learners: "2.5k+ learners",
      percentage: "10%",
      color: "bg-green-50 hover:bg-green-100"
    },
    {
      language: "French",
      icon: "🇫🇷",
      learners: "1.5k+ learners",
      percentage: "6%",
      color: "bg-red-50 hover:bg-red-100"
    }
  ];

  return (
    <div className='flex-1 bg-gradient-to-b from-blue-50 to-white'>
      {/* Hero Section - Reduced top padding */}
      <section className="relative pt-8 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Gradient Blob */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <TrustBadge text="Trusted by 25k+ Students Worldwide" />

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-8 max-w-4xl">
              Master Languages with
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Expert Tutors</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-600 max-w-2xl mb-12">
              Connect with verified native speakers and certified language tutors for personalized 1-on-1 video lessons. Learn at your own pace, anytime.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <LandingButton 
                onClick={() => navigate('/sign-up')}
                variant="primary"
              >
                Start Learning
              </LandingButton>
              <LandingButton 
                onClick={() => navigate('/tutor')}
                variant="white"
              >
                Become a Tutor
              </LandingButton>
            </div>

            {/* Trust Features */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Shield, text: "Verified Tutors" },
                { icon: Video, text: "HD Video Chat" },
                { icon: Star, text: "Expert Teachers" },
                { icon: MessageCircle, text: "Direct Messaging" },
                { icon: Lock, text: "Secure Payments" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center justify-center gap-2 text-gray-600">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Reduced padding */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose SpeakIn?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Experience the most effective way to learn a new language with our unique features
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} {...benefit} />
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section - Reduced padding */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Languages We Offer</h2>
            <p className="text-gray-600 text-lg">Join our community of 25,000+ language learners worldwide</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {languages.map((lang, index) => (
              <LanguageCard key={index} {...lang} />
            ))}
          </div>
        </div>
      </section>

      {/* Payment Security Section - Reduced padding */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-12">
        <div className="container mx-auto px-4">
        {/* New Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 leading-relaxed tracking-tight py-1">
          Enterprise-Grade Payment Security
        </h2>
          <p className="text-lg text-gray-600">
            Experience seamless and secure transactions powered by our strategic partnership with Stripe's global payment infrastructure
          </p>
        </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-8 p-6 bg-blue-50 rounded-xl">
                  {[
                    { value: "99.99%", label: "Uptime", description: "Industry-leading reliability" },
                    { value: "250M+", label: "Users Protected", description: "Trusted globally" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                      <div className="font-medium text-gray-900 mb-1">{stat.label}</div>
                      <div className="text-sm text-gray-600">{stat.description}</div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Testimonial */}
                <blockquote className="relative p-6 bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl text-center">
                  <div className="relative z-10">
                    <p className="text-lg text-gray-700 font-medium mb-4 mx-auto">
                      "Stripe powers payments for millions of businesses worldwide"
                    </p>
                    <footer className="text-sm font-medium text-gray-600">
                      Trusted by leading companies globally
                    </footer>
                  </div>
                </blockquote>
              </div>
            </div>

            {/* Enhanced Security Badge */}
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 rounded-full shadow-lg">
                <Lock className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Bank-grade encryption for your data</span>
              </div>
            </div>
            {/* Stripe Partnership Banner */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <img 
                src={stripePartner} 
                alt="Powered by Stripe" 
                className="h-8" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Reduced padding */}
      <section className="py-12 bg-gradient-to-br from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Want to Start Teaching?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Share your language expertise and earn money by becoming a tutor on our platform
          </p>
          <LandingButton 
            onClick={() => navigate('/tutor')}
            variant="white"
          >
            Become a Tutor
          </LandingButton>
        </div>
      </section>
    </div>  
  )
}

export default LandingContent;