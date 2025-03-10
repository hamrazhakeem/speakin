import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminTable from "../ui/AdminTable";
import useAxios from "../../../hooks/useAxios";
import LoadingSpinner from "../../common/ui/LoadingSpinner";
import { adminApi } from "../../../api/adminApi";

const UsersManagement = () => {
	const axiosInstance = useAxios();
	const [students, setStudents] = useState([]);
	const [tutors, setTutors] = useState([]);
	const [pendingTutors, setPendingTutors] = useState([]);
	const [languageChangeRequests, setLanguageChangeRequests] = useState([]);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const [usersResponse, requestsResponse] = await Promise.all([
				adminApi.getUsers(axiosInstance),
				adminApi.getLanguageChangeRequests(axiosInstance),
			]);

			const users = usersResponse;
			const requests = requestsResponse;

			const studentData = users.filter((user) => user.user_type === "student");
			const approvedTutors = users.filter(
				(user) =>
					user.user_type === "tutor" && user.tutor_details.status === "approved"
			);
			const pendingTutorsData = users.filter(
				(user) =>
					user.user_type === "tutor" && user.tutor_details.status === "pending"
			);

			setStudents(studentData);
			setTutors(approvedTutors);
			setPendingTutors(pendingTutorsData);
			setLanguageChangeRequests(requests);
		} catch (error) {
			setStudents([]);
			setTutors([]);
			setPendingTutors([]);
			setLanguageChangeRequests([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleAction = async (userId, action) => {
		try {
			await adminApi.updateUserStatus(axiosInstance, userId, action);
			fetchUsers();
		} catch (error) {
			console.error("Error updating user status:", error);
		}
	};

	const handleVerify = async (userId) => {
		try {
			const response = await adminApi.getUserDetails(axiosInstance, userId);
			navigate(`/admin/verify-tutor/${userId}`, { state: response });
		} catch (error) {
			console.error("Error verifying tutor:", error);
		}
	};

	const handleLanguageChangeVerify = async (requestId) => {
		try {
			const requestData = languageChangeRequests.find(
				(request) => request.id === requestId
			);
			if (requestData) {
				navigate(`/admin/verify-language/${requestId}`, {
					state: requestData,
				});
			}
		} catch (error) {
			setLanguageChangeRequests([]);
		}
	};

	const studentColumns = [
		"No.",
		"User Info",
		"Language to Learn",
		"Balance Credits",
		"Status",
		"Action",
	];
	const tutorColumns = [
		"No.",
		"User Info",
		"Language to Teach",
		"Balance Credits",
		"Status",
		"Action",
	];
	const pendingColumns = [
		"No.",
		"User Info",
		"Language to Teach",
		"Required Credits",
		"Action",
	];
	const languageRequestColumns = [
		"No.",
		"User Info",
		"Current Language",
		"Requested Language",
		"Action",
	];

	return (
		<div className="max-w-7xl mx-auto">
			<div className="mb-6 md:mb-8">
				<div className="flex flex-col">
					<h1 className="text-xl md:text-2xl font-bold text-white">
						User Management
					</h1>
					<p className="text-sm text-zinc-400 mt-2">
						Manage all users and their permissions
					</p>
				</div>
			</div>

			{loading ? (
				<div className="flex justify-center items-center h-64">
					<LoadingSpinner size="lg" className="text-white" />
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 md:gap-8">
					<AdminTable
						title="Students"
						columns={studentColumns}
						data={students.map((student, index) => ({
							id: index + 1,
							name: student.name,
							email: student.email,
							avatar: student.profile_image,
							language:
								student.language_to_learn
									.map((lang) => lang.language)
									.join(", ") || "N/A",
							credits: `${student.balance_credits} Credits`,
							status: student.is_active ? "Active" : "Inactive",
							action: (
								<button
									className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors ${
										student.is_active
											? "bg-red-500 hover:bg-red-600"
											: "bg-emerald-500 hover:bg-emerald-600"
									}`}
									onClick={() => handleAction(student.id, !student.is_active)}
								>
									{student.is_active ? "Block" : "Unblock"}
								</button>
							),
						}))}
					/>

					<AdminTable
						title="Tutors"
						columns={tutorColumns}
						data={tutors.map((tutor, index) => ({
							id: index + 1,
							name: tutor.tutor_details.speakin_name,
							email: tutor.email,
							avatar: tutor.profile_image,
							language:
								tutor.tutor_language_to_teach
									.map((lang) => lang.language)
									.join(", ") || "N/A",
							credits: `${tutor.balance_credits} Credits`,
							status: tutor.is_active ? "Active" : "Inactive",
							action: (
								<button
									className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors ${
										tutor.is_active
											? "bg-red-500 hover:bg-red-600"
											: "bg-emerald-500 hover:bg-emerald-600"
									}`}
									onClick={() => handleAction(tutor.id, !tutor.is_active)}
								>
									{tutor.is_active ? "Block" : "Unblock"}
								</button>
							),
						}))}
					/>

					<AdminTable
						title="Pending Tutors"
						columns={pendingColumns}
						data={pendingTutors.map((tutor, index) => ({
							id: index + 1,
							name: tutor.tutor_details.speakin_name,
							email: tutor.email,
							avatar: tutor.profile_image,
							language: tutor.tutor_language_to_teach
								.map((lang) => lang.language)
								.join(", "),
							credits: `${tutor.tutor_details.required_credits} Credits`,
							action: (
								<button
									className="inline-flex px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
									onClick={() => handleVerify(tutor.id)}
								>
									Verify
								</button>
							),
						}))}
						isPending={true}
					/>

					<AdminTable
						title="Language Change Requests"
						columns={languageRequestColumns}
						data={languageChangeRequests.map((request, index) => ({
							id: index + 1,
							name: request.full_name || "N/A",
							email: request.user?.email || "N/A",
							avatar: request.profile_image,
							language: request.tutor_language_to_teach?.[0]?.language || "N/A",
							newLanguage: request.new_language || "N/A",
							action: (
								<button
									className="inline-flex px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
									onClick={() => handleLanguageChangeVerify(request.id)}
								>
									Verify
								</button>
							),
						}))}
					/>
				</div>
			)}
		</div>
	);
};

export default UsersManagement;
