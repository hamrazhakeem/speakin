import React, { useState, useEffect } from "react";
import useAxios from "../../../../hooks/useAxios";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogOut, Clock, Calendar } from "lucide-react";
import LoadingSpinner from "../../../common/ui/LoadingSpinner";
import PrimaryButton from "../../common/ui/buttons/PrimaryButton";

const SessionSummary = () => {
	const location = useLocation();
	const { bookingId } = location.state || {};
	const axiosInstance = useAxios();
	const navigate = useNavigate();
	const { userId } = useSelector((state) => state.auth);
	const [userType, setUserType] = useState(null);
	const [sessionDetails, setSessionDetails] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!bookingId) {
			navigate("/");
			return;
		}

		const fetchSessionDetails = async () => {
			try {
				// Get user type
				const userResponse = await axiosInstance.get(`users/${userId}/`);
				setUserType(userResponse.data.user_type);

				// Get booking details
				const bookingResponse = await axiosInstance.get(
					`bookings/${bookingId}/`
				);
				const availabilityResponse = await axiosInstance.get(
					`tutor-availabilities/${bookingResponse.data.availability}/`
				);
				setSessionDetails(availabilityResponse.data);

				// Update booking status
				await axiosInstance.patch(`bookings/${bookingId}/`, {
					booking_status: "completed",
				});

				setLoading(false);
			} catch (error) {
				console.error("Error fetching session details:", error);
				setLoading(false);
			}
		};

		fetchSessionDetails();
	}, [bookingId, userId]);

	const handleReturn = () => {
		if (userType === "student") {
			navigate("/bookings");
		} else {
			navigate("/tutor/sessions");
		}
	};

	const formatDateTime = (dateString) => {
		return new Date(dateString).toLocaleString("en-US", {
			dateStyle: "medium",
			timeStyle: "short",
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<LoadingSpinner size="lg" className="text-blue-600" />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6">
			<div className="max-w-3xl mx-auto">
				<div className="bg-white shadow-lg rounded-2xl overflow-hidden">
					{/* Meeting Left Banner */}
					<div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-center">
						<div className="bg-white/10 rounded-full p-4 w-fit mx-auto mb-4">
							<LogOut className="h-12 w-12 text-white" />
						</div>
						<h2 className="text-3xl font-bold text-white mb-2">
							You've left the meeting
						</h2>
						<p className="text-blue-100">Your session has ended</p>
					</div>

					{/* Session Details */}
					<div className="p-6 sm:p-8 space-y-6">
						{sessionDetails && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Time and Duration */}
								<div className="bg-gray-50 rounded-xl p-4 flex items-start space-x-4">
									<Clock className="w-6 h-6 text-blue-600 mt-1" />
									<div>
										<h3 className="font-medium text-gray-900">Session Time</h3>
										<p className="text-gray-600">
											{formatDateTime(sessionDetails.start_time)}
										</p>
										<p className="text-sm text-gray-500 mt-1">
											Duration:{" "}
											{sessionDetails.session_type === "standard" ? "60" : "20"}{" "}
											minutes
										</p>
									</div>
								</div>

								{/* Session Type */}
								<div className="bg-gray-50 rounded-xl p-4 flex items-start space-x-4">
									<Calendar className="w-6 h-6 text-blue-600 mt-1" />
									<div>
										<h3 className="font-medium text-gray-900">Session Type</h3>
										<p className="text-gray-600 capitalize">
											{sessionDetails.session_type}
										</p>
										<p className="text-sm text-gray-500 mt-1">
											Language: {sessionDetails.language_to_teach}
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Action Button */}
						<div className="pt-6">
							<PrimaryButton onClick={handleReturn} className="w-full">
								Return to {userType === "student" ? "Bookings" : "Sessions"}
							</PrimaryButton>
						</div>

						{/* Support Section */}
						<div className="mt-8 border-t border-gray-200 pt-6">
							<div className="text-center">
								<h4 className="text-sm font-medium text-gray-900">
									Need Support?
								</h4>
								<p className="mt-1 text-sm text-gray-500">
									If you experienced any issues during the session,{" "}
									<button
										onClick={() => navigate("/support")}
										className="text-blue-600 hover:text-blue-800"
									>
										contact our support team
									</button>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SessionSummary;
