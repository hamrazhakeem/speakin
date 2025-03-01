import React from "react";
import { useNavigate } from "react-router-dom";
import {
	Globe,
	Users,
	Shield,
	Star,
	Video,
	MessageCircle,
	Sparkles,
} from "lucide-react";
import { HeroSection, ContentSection, CTASection } from "./PageSection";
import TrustBadge from "../../common/ui/landing/TrustBadge";
import LandingButton from "../../common/ui/buttons/LandingButton";

const CompanyOverview = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
			<HeroSection
				badge={<TrustBadge text="Trusted by 25k+ Students" />}
				title={
					<>
						Bridging Cultures Through
						<span className="relative inline-block">
							<span className="relative text-blue-100"> Language Learning</span>
						</span>
					</>
				}
				description="Founded with a vision to make language learning accessible to everyone, SpeakIn connects passionate learners with expert tutors worldwide. We believe that understanding a language opens doors to new cultures, perspectives, and opportunities."
			/>

			<ContentSection
				title="Our Global Impact"
				description="Join our growing community of language learners and expert tutors from around the world"
			>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					{[
						{
							number: "20+",
							label: "Countries",
							icon: <Globe className="w-5 h-5 text-blue-600" />,
						},
						{
							number: "5000+",
							label: "Expert Tutors",
							icon: <Users className="w-5 h-5 text-blue-600" />,
						},
						{
							number: "25k+",
							label: "Active Students",
							icon: <Star className="w-5 h-5 text-blue-600" />,
						},
						{
							number: "100k+",
							label: "Lessons Completed",
							icon: <Video className="w-5 h-5 text-blue-600" />,
						},
					].map((stat, index) => (
						<div
							key={index}
							className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-200"
						>
							<div className="bg-white p-6 rounded-xl border border-gray-200 shadow hover:shadow-lg">
								<div className="flex items-center gap-4 mb-2">
									<div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
										{stat.icon}
									</div>
									<div className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
										{stat.number}
									</div>
								</div>
								<div className="text-sm text-gray-600">{stat.label}</div>
							</div>
						</div>
					))}
				</div>
			</ContentSection>

			<ContentSection
				title="Our Core Values"
				description="The principles that guide us in creating the best language learning experience"
				bgWhite
			>
				<div className="grid md:grid-cols-3 gap-8">
					{[
						{
							icon: <Shield className="w-8 h-8 text-blue-600" />,
							title: "Trust & Safety",
							description:
								"We verify all tutors and ensure a safe learning environment for our community.",
						},
						{
							icon: <Sparkles className="w-8 h-8 text-blue-600" />,
							title: "Excellence",
							description:
								"We maintain high standards for our tutors and learning experience.",
						},
						{
							icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
							title: "Communication",
							description:
								"We believe in clear, open communication and continuous feedback.",
						},
					].map((value, index) => (
						<div
							key={index}
							className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-200"
						>
							<div className="h-full p-8 bg-white rounded-xl border border-gray-200 shadow hover:shadow-lg">
								<div className="p-3 bg-blue-50 rounded-lg w-fit mb-6 group-hover:bg-blue-100 transition-colors">
									{value.icon}
								</div>
								<h3 className="text-xl font-semibold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
									{value.title}
								</h3>
								<p className="text-gray-600">{value.description}</p>
							</div>
						</div>
					))}
				</div>
			</ContentSection>

			<CTASection
				title="Ready to Start Your Language Learning Journey?"
				description="Join thousands of students already learning with SpeakIn"
			>
				<LandingButton onClick={() => navigate("/sign-up")} variant="white">
					Get Started
				</LandingButton>
			</CTASection>
		</div>
	);
};

export default CompanyOverview;
