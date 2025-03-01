export const commonApi = {
	forgotPassword: (axios, email) =>
		axios
			.post(`${import.meta.env.VITE_API_GATEWAY_URL}forgot-password/`, {
				email,
			})
			.then((response) => response.data),

	verifyOtp: (axios, data) =>
		axios
			.post(
				`${import.meta.env.VITE_API_GATEWAY_URL}forgot-password-verify-otp/`,
				{
					email: data.email,
					otp: data.otp,
					cache_key: data.cache_key,
				}
			)
			.then((response) => response.data),

	resendOtp: (axios, data) =>
		axios
			.post(
				`${import.meta.env.VITE_API_GATEWAY_URL}forgot-password-resend-otp/`,
				{
					email: data.email,
					cache_key: data.cache_key,
				}
			)
			.then((response) => response.data),

	setNewPassword: (axios, data) =>
		axios
			.post(`${import.meta.env.VITE_API_GATEWAY_URL}set-new-password/`, {
				email: data.email,
				newPassword: data.newPassword,
				cache_key: data.cache_key,
			})
			.then((response) => response.data),
};
