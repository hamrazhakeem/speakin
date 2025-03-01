import React, { forwardRef } from "react";

const RadioButton = forwardRef(({ checked, onChange, label }, ref) => (
	<label className="flex items-center space-x-2 cursor-pointer">
		<input
			type="radio"
			className="form-radio"
			checked={checked}
			onChange={onChange}
			ref={ref}
		/>
		<span>{label}</span>
	</label>
));

export default RadioButton;
