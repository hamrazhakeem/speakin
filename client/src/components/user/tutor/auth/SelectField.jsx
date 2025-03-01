import React, { forwardRef } from "react";

const SelectField = forwardRef(
	({ options, placeholder, error, ...props }, ref) => (
		<div className="relative">
			<select
				{...props}
				ref={ref}
				className={`w-full p-3 border-2 rounded-lg appearance-none bg-white transition-all duration-200 focus:ring-2 outline-none ${
					error
						? "border-red-300 focus:ring-red-100"
						: "border-gray-200 focus:ring-blue-100 focus:border-blue-400"
				}`}
			>
				<option value="" disabled>
					{placeholder}
				</option>
				{options.map((option, index) => (
					<option key={index} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			<div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
				<svg
					className="w-5 h-5 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</div>
			{error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
		</div>
	)
);

export default SelectField;
