import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ClipboardCheck, Clock, Mail, ArrowLeft } from "lucide-react";
import StatusStep from "./StatusStep";
import PrimaryButton from "../../common/ui/buttons/PrimaryButton";

const TutorApplicationStatus = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { verifiedEmail } = location.state || {}; // Access the state

	useEffect(() => {
		if (!verifiedEmail) navigate("/tutor/request");
	}, [navigate, verifiedEmail]);

	if (!verifiedEmail) return null;

	const steps = [
		{
			number: "1",
			title: "Application Review",
			description: "Our team will review your qualifications and documents",
		},
		{
			number: "2",
			title: "Email Notification",
			description: "You'll receive an email about your application status",
		},
		{
			number: "3",
			title: "Platform Access",
			description:
				"If approved, you'll get access to set up your tutor profile",
		},
	];

	return (
		<div className="flex-1 bg-gray-50">
			<div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24">
				<div className="bg-white shadow-lg rounded-2xl p-8">
					{/* Header Section */}
					<div className="text-center mb-8">
						<div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
							<ClipboardCheck className="w-8 h-8 text-blue-600" />
						</div>
						<h1 className="text-2xl font-bold text-gray-900">
							Application Submitted
						</h1>
						<p className="mt-2 text-gray-600">
							Thank you for applying to be a tutor with SpeakIn
						</p>
					</div>

					{/* Status Section */}
					<div className="bg-gray-50 rounded-xl p-6 mb-8">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								<Clock className="w-5 h-5 text-blue-600" />
								<span className="font-medium text-gray-900">
									Current Status
								</span>
							</div>
							<span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
								Under Review
							</span>
						</div>
						<p className="text-gray-600 text-sm leading-relaxed">
							Our team will carefully review your application. This process
							typically takes up to three business days. You will receive
							updates about your application status via email.
						</p>
					</div>

					{/* Next Steps */}
					<div className="space-y-6 mb-8">
						<h2 className="text-lg font-medium text-gray-900">
							What happens next?
						</h2>
						<div className="space-y-4">
							{steps.map((step, index) => (
								<StatusStep
									key={index}
									number={step.number}
									title={step.title}
									description={step.description}
								/>
							))}
						</div>
					</div>

					{/* Action Buttons */}
					<div className="space-y-4">
						<PrimaryButton onClick={() => navigate("/tutor")} icon={ArrowLeft}>
							Return to Home
						</PrimaryButton>

						<div className="flex items-center justify-center gap-2 text-sm text-gray-500">
							<Mail className="w-4 h-4" />
							<span>Check your email for updates</span>
						</div>
					</div>

					{/* Support Section */}
					<div className="mt-8 pt-6 border-t border-gray-200">
						<p className="text-center text-sm text-gray-600">
							Have questions about your application?{" "}
							<Link
								to="/support"
								className="text-blue-600 hover:text-blue-800 font-medium"
							>
								Contact Support
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TutorApplicationStatus;
