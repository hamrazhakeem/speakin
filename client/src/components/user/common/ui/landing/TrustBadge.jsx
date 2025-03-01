import React from "react";

const TrustBadge = ({ text }) => {
	return (
		<div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-sm font-medium group cursor-pointer hover:bg-blue-100 transition-colors">
			<span className="relative flex h-2 w-2">
				<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
				<span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
			</span>
			{text}
		</div>
	);
};

export default TrustBadge;
