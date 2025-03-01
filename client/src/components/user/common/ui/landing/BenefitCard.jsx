import React from "react";

const BenefitCard = ({ icon: Icon, title, description }) => {
	return (
		<div className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200">
			<div className="p-3 bg-blue-50 rounded-2xl w-fit mb-6 group-hover:bg-blue-100 transition-colors">
				<Icon className="w-8 h-8 text-blue-600" />
			</div>
			<h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
			<p className="text-gray-600">{description}</p>
		</div>
	);
};

export default BenefitCard;
