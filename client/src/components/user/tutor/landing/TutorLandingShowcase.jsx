import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Calendar, Award } from 'lucide-react';
import TrustBadge from '../../common/ui/landing/TrustBadge';
import BenefitCard from '../../common/ui/landing/BenefitCard';
import RequirementCard from './RequirementCard';
import LandingButton from '../../common/ui/buttons/LandingButton';

const TutorLandingShowcase = () => {
    const navigate = useNavigate();

    const benefits = [
        {
            icon: Shield,
            title: "Supportive Community",
            description: "Connect with fellow educators and share teaching experiences in our vibrant community"
        },
        {
            icon: Calendar,
            title: "Flexible Schedule",
            description: "Design your teaching schedule around your lifestyle with our easy-to-use platform"
        },
        {
            icon: Award,
            title: "Professional Growth",
            description: "Access exclusive teaching resources and development opportunities"
        }
    ];

    const requirements = [
        {
            title: "For Native Speakers",
            requirements: [
                "Government-issued ID",
                "Stable internet connection",
                "Webcam for video lessons",
                "Teaching experience (preferred)",
                "Professional profile photo"
            ]
        },
        {
            title: "For Certified Teachers",
            requirements: [
                "Language teaching certification",
                "Proof of language proficiency",
                "Stable internet connection",
                "Webcam for video lessons",
                "Professional profile photo"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Hero Section - Reduced padding */}
            <section className="relative pt-8 pb-20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <TrustBadge text="Join 5000+ Expert Tutors Worldwide" />

                    {/* Main Heading - Added padding-bottom and line-height */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-8">
                        Transform Lives Through
                        <span className="block mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight pb-2">
                            Language Teaching
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
                        Share your language expertise and connect with students globally. 
                        Teach on your schedule, from anywhere in the world.
                    </p>

                    {/* Stats Row */}
                    <div className="flex justify-center gap-8 mb-12">
                        {[
                        { label: 'Active Students', value: '25,000+' },
                        { label: 'Countries', value: '20+' }
                        ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <LandingButton 
                        onClick={() => navigate('/tutor/sign-in')}
                        variant="primary"
                        >
                            Start Teaching
                        </LandingButton>
                        <LandingButton 
                        onClick={() => navigate('/how-it-works')}
                        variant="white"
                        >
                            Learn More
                        </LandingButton>
                    </div>
                </div>
            </section>

            {/* Benefits Section - Reduced padding */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Teach with SpeakIn?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Join our community of passionate educators making a global impact
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <BenefitCard key={index} {...benefit} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements Section - Reduced padding */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What You Need to Get Started</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Meet our basic requirements and start teaching in no time
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {requirements.map((category, index) => (
                            <RequirementCard key={index} {...category} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Reduced padding */}
            <section className="py-12 bg-gradient-to-br from-blue-600 to-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Start Your Teaching Journey?</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join our community of expert tutors and start impacting lives globally
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <LandingButton 
                        onClick={() => navigate('/tutor/verify-email')}
                        variant="white"
                        >
                            Apply Now
                        </LandingButton>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TutorLandingShowcase