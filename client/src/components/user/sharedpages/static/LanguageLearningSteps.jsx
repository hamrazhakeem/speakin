import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, Video, MessageCircle, Star } from "lucide-react";
import { HeroSection, ContentSection, CTASection } from "./PageSection";
import LandingButton from "../../common/ui/buttons/LandingButton";
import TrustBadge from "../../common/ui/landing/TrustBadge";

const LanguageLearningSteps = () => {
	const navigate = useNavigate();

	return (
		<div>
			<HeroSection
				badge={<TrustBadge text="Simple Steps to Fluency" />}
				title={
					<>
						Your Path to Language
						<span className="relative inline-block ml-3">
							<span className="relative text-blue-100">Mastery</span>
						</span>
					</>
				}
				description="Follow these simple steps to embark on your language learning journey with expert tutors who guide you every step of the way"
			/>

			<ContentSection bgWhite>
				<div className="grid gap-8 md:grid-cols-3">
					{[
						{
							icon: <Search className="w-6 h-6" />,
							title: "Find Your Tutor",
							description:
								"Browse through our verified tutors, filter by language, and read reviews to find your perfect match.",
							step: "01",
						},
						{
							icon: <Calendar className="w-6 h-6" />,
							title: "Schedule Lessons",
							description:
								"Book lessons at times that work for you with our flexible scheduling system.",
							step: "02",
						},
						{
							icon: <Video className="w-6 h-6" />,
							title: "Start Learning",
							description:
								"Connect via video chat for personalized 1-on-1 lessons tailored to your goals.",
							step: "03",
						},
					].map((item, index) => (
						<div
							key={index}
							className="relative group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
						>
							<div className="flex items-center gap-4 mb-4">
								<div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-bold">
									{item.step}
								</div>
								<div className="p-2 bg-blue-50 rounded-lg">{item.icon}</div>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-3">
								{item.title}
							</h3>
							<p className="text-gray-600">{item.description}</p>
						</div>
					))}
				</div>
			</ContentSection>

			<ContentSection
				title="Everything You Need"
				description="Our platform provides all the essential tools for effective learning"
			>
				<div className="grid md:grid-cols-3 gap-8">
					{[
						{
							icon: <MessageCircle className="w-6 h-6" />,
							title: "Chat Support",
							description: "Message tutors anytime for quick help",
						},
						{
							icon: <Star className="w-6 h-6" />,
							title: "Track Progress",
							description: "Monitor your improvement over time",
						},
						{
							icon: <Video className="w-6 h-6" />,
							title: "HD Video",
							description: "Crystal clear video chat experience",
						},
					].map((feature, index) => (
						<div
							key={index}
							className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
						>
							<div className="p-2 bg-blue-50 rounded-lg w-fit mb-4">
								{feature.icon}
							</div>
							<h3 className="text-lg font-semibold mb-2 text-gray-900">
								{feature.title}
							</h3>
							<p className="text-gray-600">{feature.description}</p>
						</div>
					))}
				</div>
			</ContentSection>

			<CTASection
				title="Ready to Start Your Journey?"
				description="Join thousands of successful language learners today"
			>
				<LandingButton onClick={() => navigate("/sign-up")} variant="white">
					Get Started Now
				</LandingButton>
			</CTASection>
		</div>
	);
};

export default LanguageLearningSteps;
