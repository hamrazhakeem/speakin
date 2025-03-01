import React, { useState } from "react";
import { Calendar as Info, X, Clock, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import useAxios from "../../../../hooks/useAxios";
import { tutorApi } from "../../../../api/tutorApi";

const SessionCreationModal = ({
	isOpen,
	onClose,
	tutorCredits,
	fetchTutorAvailability,
	teachingLanguage,
}) => {
	const [step, setStep] = useState(1);
	const [sessionType, setSessionType] = useState(null);
	const [selectedDate, setSelectedDate] = useState("");
	const [selectedTime, setSelectedTime] = useState("");
	const userId = useSelector((state) => state.auth.userId);
	const axiosInstance = useAxios();

	if (!isOpen) return null;

	const generateTimeSlots = (duration) => {
		const slots = [];
		const start = 0;
		const end = 23;

		const currentTime = new Date();
		const minimumTime = new Date(
			currentTime.getTime() + (duration === 20 ? 4 : 8) * 60 * 60 * 1000
		);

		for (let hour = start; hour <= end; hour++) {
			["00", "15", "30", "45"].forEach((minute) => {
				const checkTime = new Date(
					`${selectedDate}T${hour.toString().padStart(2, "0")}:${minute}`
				);

				if (checkTime >= minimumTime) {
					const formattedHour = hour % 12 || 12;
					const period = hour < 12 ? "AM" : "PM";
					const formattedTime = `${formattedHour}:${minute} ${period}`;

					slots.push({
						display: formattedTime,
						hour24: hour,
						minute,
					});
				}
			});
		}

		return slots;
	};

	const convertTo24Hour = (timeStr) => {
		const [time, period] = timeStr.split(" ");
		let [hours, minutes] = time.split(":");
		hours = parseInt(hours);

		if (period === "PM" && hours !== 12) {
			hours += 12;
		}
		if (period === "AM" && hours === 12) {
			hours = 0;
		}

		return `${hours.toString().padStart(2, "0")}:${minutes}`;
	};

	const handleSessionTypeSelect = (type) => {
		setSessionType(type);
		setStep(2);
	};

	const handleSubmit = async () => {
		if (!selectedDate || !selectedTime) {
			toast.error("Please select both date and time");
			return;
		}

		const time24 = convertTo24Hour(selectedTime);
		const startDateTime = new Date(`${selectedDate}T${time24}:00`);
		const endDateTime = new Date(
			startDateTime.getTime() + (sessionType === "trial" ? 20 : 60) * 60 * 1000
		);

		const sessionData = {
			tutor_id: userId,
			session_type: sessionType,
			language_to_teach: teachingLanguage,
			start_time: startDateTime.toISOString(),
			end_time: endDateTime.toISOString(),
			credits_required:
				sessionType === "trial"
					? Math.round(tutorCredits * 0.25)
					: tutorCredits,
		};

		try {
			await tutorApi.createSession(axiosInstance, sessionData);
			toast.success("Session created successfully");
			fetchTutorAvailability();
			onClose();
		} catch (error) {
			if (error.response?.status === 409) {
				toast.error(
					"A slot with this time range already exists. Please choose a different time."
				);
			} else {
				toast.error("An unexpected error occurred. Please try again.");
			}
		}
	};

	const today = new Date().toISOString().split("T")[0];

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-2xl w-full max-w-2xl">
				{/* Modal Header */}
				<div className="flex justify-between items-center p-6 border-b border-gray-100">
					<h2 className="text-2xl font-semibold text-gray-900">
						{step === 1 ? "Select Session Type" : "Choose Date & Time"}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Modal Content */}
				<div className="p-6">
					{step === 1 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Trial Session Card */}
							<div
								onClick={() => handleSessionTypeSelect("trial")}
								className="group border border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all space-y-4"
							>
								<div className="p-3 bg-blue-50 text-blue-600 rounded-lg w-fit group-hover:bg-blue-100 transition-colors">
									<Clock className="w-6 h-6" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										Trial Session
									</h3>
									<p className="text-gray-600 mb-4">
										20 minutes introduction session
									</p>
									<div className="flex items-center gap-2 text-gray-600">
										<Info className="w-4 h-4" />
										<span>{Math.round(tutorCredits * 0.25)} credits</span>
									</div>
								</div>
							</div>

							{/* Standard Session Card */}
							<div
								onClick={() => handleSessionTypeSelect("standard")}
								className="group border border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all space-y-4"
							>
								<div className="p-3 bg-green-50 text-green-600 rounded-lg w-fit group-hover:bg-green-100 transition-colors">
									<Clock className="w-6 h-6" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										Standard Session
									</h3>
									<p className="text-gray-600 mb-4">1 hour regular session</p>
									<div className="flex items-center gap-2 text-gray-600">
										<Info className="w-4 h-4" />
										<span>{tutorCredits} credits</span>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Date Selection */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Select Date
									</label>
									<input
										type="date"
										min={today}
										value={selectedDate}
										onChange={(e) => setSelectedDate(e.target.value)}
										className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
									/>
								</div>

								{/* Time Selection */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Select Time
									</label>
									<div className="h-64 overflow-y-auto border border-gray-200 rounded-xl scrollbar-thin">
										{generateTimeSlots(sessionType === "trial" ? 20 : 60)
											.length > 0 ? (
											generateTimeSlots(sessionType === "trial" ? 20 : 60).map(
												(slot) => (
													<button
														key={slot.display}
														onClick={() => setSelectedTime(slot.display)}
														className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
															selectedTime === slot.display
																? "bg-blue-50 text-blue-700"
																: ""
														}`}
													>
														{slot.display}
													</button>
												)
											)
										) : (
											<div className="p-4 text-gray-600 flex items-center gap-2">
												<AlertCircle className="w-5 h-5" />
												<span>
													No available time slots for the selected date.
												</span>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex justify-end gap-3 pt-4">
								<button
									onClick={() => setStep(1)}
									className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
								>
									Back
								</button>
								<button
									onClick={handleSubmit}
									disabled={!selectedDate || !selectedTime}
									className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									Create Session
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SessionCreationModal;
