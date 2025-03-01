import React from "react";
import { ChevronRight } from "lucide-react";

const RequirementCard = ({ title, requirements }) => {
	return (
		<div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
			<h3 className="text-2xl font-bold mb-6 text-gray-900">{title}</h3>
			<ul className="space-y-4">
				{requirements.map((req, idx) => (
					<li key={idx} className="flex items-center text-gray-700">
						<ChevronRight className="w-5 h-5 text-blue-600 mr-2" />
						{req}
					</li>
				))}
			</ul>
		</div>
	);
};

export default RequirementCard;
