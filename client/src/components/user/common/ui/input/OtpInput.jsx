import React from "react";

const OtpInput = ({ otp, handleOtpChange, handleKeyDown }) => {
	return (
		<div className="flex justify-center gap-2">
			{otp.map((digit, index) => (
				<input
					key={index}
					type="text"
					name={`otp-${index}`}
					maxLength={1}
					value={digit}
					onChange={(e) => handleOtpChange(index, e.target.value)}
					onPaste={(e) => handleOtpChange(index, "", e)}
					onKeyDown={(e) => handleKeyDown(index, e)}
					className="w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
				/>
			))}
		</div>
	);
};

export default OtpInput;
