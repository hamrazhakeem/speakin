import React from "react";
import { Ban, Home, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../common/ui/buttons/PrimaryButton";

const PaymentCancelStatus = () => {
	const navigate = useNavigate();

	return (
		<div className="flex-1 bg-gradient-to-b from-blue-50 to-white">
			<div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md mt-10 mb-10 border border-gray-100">
					{/* Status Icon */}
					<div className="text-center mb-8">
						<div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
							<Ban className="w-8 h-8 text-red-500" />
						</div>
						<h2 className="text-2xl font-bold text-gray-900">
							Payment Not Completed
						</h2>
						<p className="text-gray-600 mt-2">Your transaction was cancelled</p>
					</div>

					{/* Action Buttons */}
					<div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
						<h3 className="font-medium text-gray-900 mb-4">
							What would you like to do?
						</h3>

						<PrimaryButton
							onClick={() => navigate("/buy-credits")}
							showChevron={false}
						>
							<RefreshCcw className="w-5 h-5" />
							<span className="ml-2">Try Payment Again</span>
						</PrimaryButton>

						<button
							onClick={() => navigate("/")}
							className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors duration-200"
						>
							<Home className="w-5 h-5" />
							Return to Home
						</button>
					</div>

					{/* Support Box */}
					<div className="bg-blue-50 rounded-xl p-4">
						<p className="text-sm text-blue-800">
							Having trouble with payment? Our support team is here to help.{" "}
							<button
								onClick={() => navigate("/support")}
								className="text-blue-600 hover:text-blue-800 font-medium"
							>
								Contact Support
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PaymentCancelStatus;
