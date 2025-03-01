import React from "react";
import { UserCircle } from "lucide-react";

const ProfileImageUpload = ({
	profilePreview,
	handleProfileImage,
	maxSize = "5MB",
	supportedFormats = "JPG, PNG",
}) => {
	return (
		<div className="space-y-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
			<h2 className="text-lg font-semibold text-gray-900">Profile Picture</h2>
			<div className="flex flex-col items-center gap-4">
				<div className="w-32 h-32 rounded-full overflow-hidden">
					{profilePreview ? (
						<img
							src={profilePreview}
							alt="Profile Preview"
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full bg-gray-100 flex items-center justify-center">
							<UserCircle className="w-16 h-16 text-gray-400" />
						</div>
					)}
				</div>
				<input
					type="file"
					accept="image/*"
					onChange={handleProfileImage}
					className="hidden"
					id="profile-upload"
				/>
				<label
					htmlFor="profile-upload"
					className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer"
				>
					Upload Profile Picture
				</label>
				<p className="text-sm text-gray-500">
					Maximum file size: {maxSize}. Supported formats: {supportedFormats}
				</p>
			</div>
		</div>
	);
};

export default ProfileImageUpload;
