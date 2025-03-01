import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, CreditCard, Lock } from "lucide-react";
import { useSelector } from "react-redux";
import PrimaryButton from "../../common/ui/buttons/PrimaryButton";

const StripeRefreshContent = () => {
	const navigate = useNavigate();
	const { isTutor } = useSelector((state) => state.auth);

	const features = isTutor
		? [
				{
					icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
					title: "Secure Payments",
					description:
						"Your earnings are protected with industry-standard security measures, ensuring safe transactions every time.",
				},
				{
					icon: <CreditCard className="h-6 w-6 text-blue-600" />,
					title: "Multiple Payment Options",
					description:
						"Choose from various payment methods to suit your preference and convenience.",
				},
				{
					icon: <Lock className="h-6 w-6 text-blue-600" />,
					title: "Data Privacy",
					description:
						"We prioritize your privacy by safeguarding your financial information with advanced encryption.",
				},
		  ]
		: [
				{
					icon: <Lock className="h-6 w-6 text-blue-600" />,
					title: "Safe Transactions",
					description:
						"All payments are secured with bank-level encryption, ensuring your financial data remains private.",
				},
				{
					icon: <CreditCard className="h-6 w-6 text-blue-600" />,
					title: "Flexible Payment Methods",
					description:
						"Select from various payment options, including credit cards, debit cards, and bank transfers.",
				},
				{
					icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
					title: "Transaction Protection",
					description:
						"Your payments are protected by our guarantee policy, providing support for any transaction issues.",
				},
		  ];

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
			<div className="container mx-auto px-4 py-16">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-relaxed">
						Complete Your Payment Setup
					</h1>
					<p className="text-lg text-gray-600 mb-6">
						To start receiving payments, you'll need to complete your Stripe
						Connect account setup
					</p>
				</div>

				<div className="max-w-6xl mx-auto">
					<div className="grid md:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<div
								key={index}
								className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200"
							>
								<div className="bg-blue-50 rounded-lg p-3 inline-block mb-4">
									{feature.icon}
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-3">
									{feature.title}
								</h3>
								<p className="text-gray-600">{feature.description}</p>
							</div>
						))}
					</div>
				</div>

				<div className="text-center mt-12">
					<PrimaryButton
						onClick={() => navigate("/withdraw")}
						className="inline-flex !w-auto"
					>
						Setup Payment Method
					</PrimaryButton>
					<p className="mt-4 text-sm text-gray-500">
						You'll be redirected to payments to start over to complete your
						account setup
					</p>
				</div>
			</div>
		</div>
	);
};

export default StripeRefreshContent;
