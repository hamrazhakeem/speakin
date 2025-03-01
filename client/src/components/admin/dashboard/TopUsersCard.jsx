import React, { useEffect, useState } from "react";
import { Award } from "lucide-react";
import LoadingSpinner from "../../common/ui/LoadingSpinner";
import useAxios from "../../../hooks/useAxios";
import { adminApi } from "../../../api/adminApi";

const TopUsersCard = ({ bookings, availabilities, type = "student" }) => {
	const [loading, setLoading] = useState(true);
	const [topUsers, setTopUsers] = useState([]);
	const axiosInstance = useAxios();

	useEffect(() => {
		const fetchAndProcessUsers = async () => {
			try {
				if (!bookings || bookings.length === 0) {
					setLoading(false);
					return;
				}

				if (
					type === "tutor" &&
					(!availabilities || Object.keys(availabilities).length === 0)
				) {
					setLoading(false);
					return;
				}

				if (type === "student") {
					const studentCounts = bookings.reduce((acc, booking) => {
						if (booking.booking_status === "completed") {
							acc[booking.student_id] = (acc[booking.student_id] || 0) + 1;
						}
						return acc;
					}, {});

					const studentIds = Object.keys(studentCounts);
					const studentDetails = await Promise.all(
						studentIds.map(async (id) => {
							const userData = await adminApi.getUserDetails(axiosInstance, id);
							return {
								userId: parseInt(id),
								sessionCount: studentCounts[id],
								name: userData.name,
								languages: userData.language_to_learn.map(
									(lang) => lang.language
								),
							};
						})
					);

					setTopUsers(
						studentDetails
							.sort((a, b) => b.sessionCount - a.sessionCount)
							.slice(0, 5)
					);
				} else {
					const tutorCounts = {};
					bookings.forEach((booking) => {
						if (booking.booking_status === "completed") {
							const availability = availabilities[booking.availability];
							if (availability && availability.session_type === "standard") {
								const tutorId = availability.tutor_id;
								tutorCounts[tutorId] = (tutorCounts[tutorId] || 0) + 1;
							}
						}
					});

					const tutorIds = Object.keys(tutorCounts);
					const tutorDetails = await Promise.all(
						tutorIds.map(async (id) => {
							const userData = await adminApi.getUserDetails(axiosInstance, id);
							return {
								userId: parseInt(id),
								sessionCount: tutorCounts[id],
								name: userData.tutor_details.speakin_name,
								languages: userData.tutor_language_to_teach.map(
									(lang) => lang.language
								),
							};
						})
					);

					setTopUsers(
						tutorDetails
							.sort((a, b) => b.sessionCount - a.sessionCount)
							.slice(0, 5)
					);
				}
			} catch (error) {
				setTopUsers([]);
			} finally {
				setLoading(false);
			}
		};

		fetchAndProcessUsers();
	}, [bookings, availabilities, type]);

	if (loading) {
		return (
			<div className="w-full bg-zinc-800 rounded-lg">
				<div className="flex justify-center items-center h-48">
					<LoadingSpinner size="lg" />
				</div>
			</div>
		);
	}

	if (!topUsers.length) {
		return (
			<div className="w-full bg-zinc-800 rounded-lg border border-zinc-700">
				<div className="flex flex-row items-center justify-between p-4">
					<h3 className="text-lg font-semibold text-white">
						Top Performing {type === "student" ? "Students" : "Tutors"}
					</h3>
					<Award className="w-5 h-5 text-yellow-500" />
				</div>
				<div className="flex justify-center items-center h-48 text-zinc-400">
					No {type === "student" ? "students" : "tutors"} data available yet
				</div>
			</div>
		);
	}

	return (
		<div className="w-full bg-zinc-800 rounded-lg border border-zinc-700">
			<div className="flex flex-row items-center justify-between p-4">
				<h3 className="text-lg font-semibold text-white">
					Top Performing {type === "student" ? "Students" : "Tutors"}
				</h3>
				<Award className="w-5 h-5 text-yellow-500" />
			</div>
			<div className="p-4 space-y-4">
				{topUsers.map((user, index) => (
					<div
						key={user.userId}
						className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800"
					>
						<div className="flex items-center space-x-4">
							<div className="flex-shrink-0 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
								<span className="text-sm font-medium text-white">
									#{index + 1}
								</span>
							</div>
							<div>
								<h4 className="text-sm font-medium text-white">{user.name}</h4>
								<p className="text-xs text-zinc-400">
									{user.languages.join(", ")}
								</p>
							</div>
						</div>
						<div className="text-right">
							<p className="text-sm font-medium text-white">
								{user.sessionCount}
							</p>
							<p className="text-xs text-zinc-400">Completed Sessions</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default TopUsersCard;
