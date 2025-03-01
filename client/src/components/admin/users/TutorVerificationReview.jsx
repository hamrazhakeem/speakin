import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { toast } from "react-hot-toast";
import { VerificationContent, InfoItem } from "./VerificationContent";
import { adminApi } from "../../../api/adminApi";

const TutorVerificationReview = () => {
	const location = useLocation();
	const { state: userData } = location;
	const axiosInstance = useAxios();
	const navigate = useNavigate();
	const [approveLoading, setApproveLoading] = useState(false);
	const [denyLoading, setDenyLoading] = useState(false);

	const handleAction = async (action) => {
		const isApprove = action === "approve";
		const loadingSetter = isApprove ? setApproveLoading : setDenyLoading;

		loadingSetter(true);
		try {
			if (isApprove) {
				await adminApi.approveTutor(axiosInstance, userData.id);
				toast.success("Tutor Approved Successfully");
			} else {
				await adminApi.denyTutor(axiosInstance, userData.id);
				toast.success("Tutor Denied Successfully");
			}
			navigate("/admin/manage-users");
		} catch (error) {
			toast.error(`Failed to ${isApprove ? "Approve" : "Deny"} Tutor`);
		} finally {
			loadingSetter(false);
		}
	};

	if (!userData) {
		return (
			<div className="text-center py-12">
				<p className="text-zinc-400">No user data available.</p>
			</div>
		);
	}

	const sections = [
		{
			title: "Personal Information",
			content: (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<InfoItem label="Full Name" value={userData.name} />
					<InfoItem label="Email" value={userData.email} />
					<InfoItem label="Country" value={userData.country} />
					<InfoItem
						label="SpeakIn Name"
						value={userData.tutor_details.speakin_name}
					/>
					<InfoItem
						label="Profile Image"
						value={userData.profile_image}
						type="link"
					/>
				</div>
			),
		},
		{
			title: "Languages Spoken",
			content: (
				<div className="flex flex-wrap gap-2">
					{userData.language_spoken.map((lang, index) => (
						<span
							key={index}
							className="px-3 py-1 rounded-full text-sm bg-zinc-800 text-white"
						>
							{lang.language} ({lang.proficiency})
						</span>
					))}
				</div>
			),
		},
		{
			title: "Languages to Teach",
			content: (
				<div className="flex flex-wrap gap-2">
					{userData.tutor_language_to_teach.map((lang, index) => (
						<div
							key={index}
							className={`px-4 py-2 rounded-lg text-sm ${
								lang.is_native
									? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
									: "bg-blue-500/20 text-blue-400 border border-blue-500/20"
							}`}
						>
							<div className="font-medium">{lang.language}</div>
							<div className="text-xs mt-1 opacity-80">
								{lang.is_native ? "Native Speaker" : "Non-Native Speaker"}
							</div>
						</div>
					))}
				</div>
			),
		},
		{
			title: "Tutor Details",
			content: (
				<div className="space-y-6">
					<InfoItem label="About" value={userData.tutor_details.about} />
					{userData.tutor_details.govt_id ? (
						<InfoItem
							label="Government ID"
							value={userData.tutor_details.govt_id}
							type="link"
						/>
					) : (
						<InfoItem
							label="Certificate"
							value={userData.tutor_details.certificate}
							type="link"
						/>
					)}
					<InfoItem
						label="Intro Video"
						value={userData.tutor_details.intro_video}
						type="link"
					/>
					<InfoItem
						label="Required Credits"
						value={userData.tutor_details.required_credits}
					/>
				</div>
			),
		},
	];

	return (
		<VerificationContent
			title="Verify Tutor Application"
			subtitle="Review and verify tutor information"
			sections={sections}
			approveLoading={approveLoading}
			denyLoading={denyLoading}
			onApprove={() => handleAction("approve")}
			onDeny={() => handleAction("deny")}
		/>
	);
};

export default TutorVerificationReview;
