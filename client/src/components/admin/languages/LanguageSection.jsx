import React from "react";

const LanguageSection = ({ title, subtitle, items, type = "language" }) => {
	return (
		<div className="bg-zinc-900/50 backdrop-blur border border-zinc-800/50 rounded-lg overflow-hidden">
			<div className="p-6 border-b border-zinc-800/50">
				<h3 className="text-lg font-medium text-white">{title}</h3>
				<p className="text-sm text-zinc-400 mt-1">{subtitle}</p>
			</div>
			<div className="p-6">
				<div className="space-y-4">
					{items &&
						items.map((item) => (
							<div
								key={type === "language" ? item.id : item.level}
								className="flex items-center justify-between p-4 bg-black/50 backdrop-blur rounded-lg border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
							>
								{type === "language" ? (
									<span className="text-white">{item.name}</span>
								) : (
									<div>
										<span className="text-white font-medium">{item.level}</span>
										<p className="text-sm text-zinc-400 mt-1">
											{item.description}
										</p>
									</div>
								)}
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default LanguageSection;
