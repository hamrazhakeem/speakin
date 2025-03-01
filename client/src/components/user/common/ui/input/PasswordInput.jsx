import React, { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = forwardRef(({ error, ...props }, ref) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div>
			<div className="relative">
				<input
					placeholder="Password"
					ref={ref}
					type={showPassword ? "text" : "password"}
					{...props}
					className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors duration-200 outline-none pr-12 ${
						error
							? "border-red-300 focus:border-red-500"
							: "border-gray-200 focus:border-blue-500"
					}`}
				/>
				<button
					type="button"
					onClick={() => setShowPassword(!showPassword)}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
				>
					{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
				</button>
			</div>
			{error && <p className="mt-1.5 text-sm text-red-500">{error.message}</p>}
		</div>
	);
});

export default PasswordInput;
