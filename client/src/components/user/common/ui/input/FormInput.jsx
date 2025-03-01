import React, { forwardRef } from "react";

const FormInput = forwardRef(
	(
		{
			type = "text",
			placeholder,
			value,
			onChange,
			error,
			icon: Icon,
			required = false,
			className = "",
			rules, // for react-hook-form validation rules
			...props
		},
		ref
	) => {
		return (
			<div>
				<div className="relative">
					{Icon && (
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Icon className="h-5 w-5 text-gray-400" />
						</div>
					)}
					<input
						{...props}
						ref={ref}
						type={type}
						placeholder={placeholder}
						required={required}
						value={value}
						onChange={onChange}
						className={`w-full ${
							Icon ? "pl-11" : "px-4"
						} py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors duration-200 outline-none ${
							error
								? "border-red-300 focus:ring-red-100"
								: "border-gray-200 focus:ring-blue-100 focus:border-blue-400"
						} ${className}`}
					/>
				</div>
				{error && (
					<p className="text-red-500 text-sm mt-1">{error.message || error}</p>
				)}
			</div>
		);
	}
);

export default FormInput;
