import React from "react";
import PropTypes from "prop-types";

const FormInput = ({
	label,
	type = "text",
	icon: Icon,
	value,
	onChange,
	required = false,
	placeholder,
	error,
	className = "",
}) => {
	return (
		<div className={className}>
			{label && (
				<label className="block text-sm font-medium text-zinc-400 mb-2">
					{label}
				</label>
			)}
			<div className="relative">
				{Icon && (
					<Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
				)}
				<input
					type={type}
					required={required}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					className={`w-full ${
						Icon ? "pl-10" : "pl-4"
					} pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
						error ? "border-red-500 focus:ring-red-500" : ""
					}`}
				/>
				{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
			</div>
		</div>
	);
};

FormInput.propTypes = {
	label: PropTypes.string,
	type: PropTypes.string,
	icon: PropTypes.elementType,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	required: PropTypes.bool,
	placeholder: PropTypes.string,
	error: PropTypes.string,
	className: PropTypes.string,
};

export default FormInput;
