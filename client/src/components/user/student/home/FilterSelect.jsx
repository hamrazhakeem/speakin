import React from "react";

const FilterSelect = ({
	icon,
	value,
	onChange,
	options,
	placeholder,
	renderOption,
	userLanguageMessage = "(You speak this)", // Default message
}) => {
	return (
		<div className="relative flex-1">
			<div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
				{icon}
			</div>
			<select
				value={value}
				onChange={onChange}
				className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 
          bg-white/90 backdrop-blur-sm
          text-gray-900
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
          transition-colors shadow-sm scrollbar-thin
          appearance-none"
			>
				<option value="">{placeholder}</option>
				{options.map((option) => {
					if (renderOption) {
						const { value, label, isUserLanguage } = renderOption(option);
						return (
							<option
								key={value}
								value={value}
								className={isUserLanguage ? "font-semibold text-blue-600" : ""}
							>
								{label} {isUserLanguage ? userLanguageMessage : ""}
							</option>
						);
					}
					return (
						<option key={option} value={option}>
							{option}
						</option>
					);
				})}
			</select>
			<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
				<svg
					className="h-5 w-5 text-gray-500"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
						clipRule="evenodd"
					/>
				</svg>
			</div>
		</div>
	);
};

export default FilterSelect;
