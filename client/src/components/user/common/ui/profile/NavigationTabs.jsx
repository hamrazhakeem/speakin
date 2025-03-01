import React from "react";
import { useNavigate } from "react-router-dom";

const NavigationTabs = ({ tabs }) => {
	const navigate = useNavigate();

	return (
		<nav className="max-w-4xl mx-auto mb-8 flex space-x-1 rounded-xl bg-blue-50 p-1">
			{tabs.map((tab) => (
				<button
					key={tab.label}
					onClick={() => navigate(tab.path)}
					className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200
            ${
							tab.active
								? "bg-white text-blue-600 shadow-sm"
								: "text-gray-600 hover:text-blue-600"
						}`}
				>
					{tab.label}
				</button>
			))}
		</nav>
	);
};

export default NavigationTabs;
