export const adminApi = {
	getTransactions: (axiosInstance) =>
		axiosInstance.get("transactions/").then((response) => response.data),

	getBookings: (axiosInstance) =>
		axiosInstance.get("bookings/").then((response) => response.data),

	getEscrowData: (axiosInstance) =>
		axiosInstance.get("escrow/").then((response) => response.data),

	getTutorAvailabilities: (axiosInstance) =>
		axiosInstance
			.get("tutor-availabilities/")
			.then((response) => response.data),

	getUsers: (axiosInstance) =>
		axiosInstance.get("users/").then((response) => response.data),

	getUserDetails: (axiosInstance, userId) =>
		axiosInstance.get(`users/${userId}/`).then((response) => response.data),

	getPlatformLanguages: (axiosInstance) =>
		axiosInstance.get("platform-languages/").then((response) => response.data),

	updateBookingStatus: (axiosInstance, bookingId, status) =>
		axiosInstance
			.patch(`bookings/${bookingId}/`, { status })
			.then((response) => response.data),

	cancelAvailability: (axiosInstance, availabilityId) =>
		axiosInstance
			.delete(`tutor-availabilities/${availabilityId}/`)
			.then((response) => response.data),

	getLanguageChangeRequests: (axiosInstance) =>
		axiosInstance
			.get("teaching-language-change-requests/")
			.then((response) => response.data),

	updateUserStatus: (axiosInstance, userId, isActive) =>
		axiosInstance
			.patch(`users/${userId}/block-unblock/`, {
				is_active: isActive,
			})
			.then((response) => response.data),

	approveTutor: (axiosInstance, tutorId) =>
		axiosInstance
			.patch(`users/${tutorId}/verify-tutor/`, {
				action: "approve",
			})
			.then((response) => response.data),

	denyTutor: (axiosInstance, tutorId) =>
		axiosInstance
			.delete(`users/${tutorId}/verify-tutor/`)
			.then((response) => response.data),

	approveLanguageChange: (axiosInstance, requestId) =>
		axiosInstance
			.patch(`teaching-language-change-requests/${requestId}/`)
			.then((response) => response.data),

	denyLanguageChange: (axiosInstance, requestId) =>
		axiosInstance
			.delete(`teaching-language-change-requests/${requestId}/`)
			.then((response) => response.data),

	signIn: (axiosInstance, credentials) =>
		axiosInstance
			.post("admin/sign-in/", credentials)
			.then((response) => response.data),

	getReports: (axiosInstance) => {
		return axiosInstance.get("reports/");
	},

	updateReportStatus: (axiosInstance, reportId, data) => {
		return axiosInstance.patch(`reports/respond/${reportId}/`, data);
	},
};
