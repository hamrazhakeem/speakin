import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useAxios from "../../../../hooks/useAxios";
import { tutorApi } from "../../../../api/tutorApi";
import LoadingSpinner from "../../../common/ui/LoadingSpinner";
import SessionCreationModal from "./SessionCreationModal";
import SessionsList from "./SessionList";
import NavigationTabs from "../../common/ui/profile/NavigationTabs";

const TutorSessionsManage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const axiosInstance = useAxios();
	const { userId, required_credits } = useSelector((state) => state.auth);
	const [sessions, setSessions] = useState(null);
	const [loading, setLoading] = useState(true);
	const [teachingLanguage, setTeachingLanguage] = useState(null);

	const tabs = [
		{ label: "Profile", path: "/tutor/dashboard" },
		{ label: "Security", path: "/tutor/password" },
		{ label: "Sessions", path: "/tutor/sessions", active: true },
		{ label: "Payments", path: "/withdraw" },
	];

	const handleAddSession = () => {
		setIsModalOpen(true);
	};

	const fetchTutorAvailability = async () => {
		setLoading(true);
		try {
			const response = await tutorApi.getTutorAvailabilities(axiosInstance);
			const tutorAvailabilities = tutorApi.filterTutorAvailabilities(
				response,
				userId
			);
			setSessions(tutorAvailabilities);
		} catch (error) {
			console.error("Error fetching session availability:", error);
			setSessions([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTutorAvailability();
		setTeachingLanguage(tutorApi.getTeachingLanguage());
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
			<main className="container mx-auto px-4 py-8">
				{/* Header Section */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Teaching Sessions
					</h1>
					<p className="text-base text-gray-600 max-w-2xl mx-auto">
						Manage your teaching schedule and session availability
					</p>
				</div>

				{/* Navigation Tabs */}
				<NavigationTabs tabs={tabs} />

				{/* Main Content */}
				<div className="max-w-6xl mx-auto">
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-200">
						{/* Loading State or Sessions List */}
						{loading ? (
							<div className="min-h-[400px] flex flex-col items-center justify-center p-8">
								<LoadingSpinner size="lg" className="text-blue-600" />
							</div>
						) : (
							<SessionsList
								sessions={sessions}
								onAddSession={handleAddSession}
								fetchTutorAvailability={fetchTutorAvailability}
							/>
						)}

						{/* Session Creation Modal */}
						<SessionCreationModal
							isOpen={isModalOpen}
							onClose={() => setIsModalOpen(false)}
							tutorCredits={required_credits}
							fetchTutorAvailability={fetchTutorAvailability}
							teachingLanguage={teachingLanguage}
						/>
					</div>
				</div>
			</main>
		</div>
	);
};

export default TutorSessionsManage;
