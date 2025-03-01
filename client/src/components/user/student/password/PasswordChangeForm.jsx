import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAxios from "../../../../hooks/useAxios";
import { toast } from "react-hot-toast";
import { studentApi } from "../../../../api/studentApi";
import NavigationTabs from "../../common/ui/profile/NavigationTabs";
import PasswordInput from "../../common/ui/input/PasswordInput";
import PrimaryButton from "../../common/ui/buttons/PrimaryButton";
import PasswordRequirements from "../../common/ui/input/PasswordRequirements";

const PasswordChangeForm = () => {
	const axiosInstance = useAxios();
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		reset,
		watch,
	} = useForm();

	const newPassword = watch("newPassword", "");

	const tabs = [
		{ label: "Profile", path: "/profile" },
		{ label: "Security", path: "/password", active: true },
		{ label: "Bookings", path: "/bookings" },
	];

	const onSubmit = async (data) => {
		try {
			setLoading(true);
			await studentApi.changePassword(axiosInstance, data);
			reset();
			toast.success("Password changed successfully");
		} catch (error) {
			if (
				error.response?.status === 400 &&
				error.response.data.current_password
			) {
				toast.error(error.response.data.current_password[0]);
			} else {
				toast.error("An error occurred. Please try again later");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex-1 bg-gradient-to-b from-blue-50 to-white">
			<main className="container mx-auto px-4 py-8">
				{/* Header Section */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Account Security
					</h1>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Manage your password and security preferences
					</p>
				</div>

				<NavigationTabs tabs={tabs} />

				{/* Main Content */}
				<div className="max-w-2xl mx-auto">
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-200">
						<div className="flex items-center gap-3 mb-8">
							<div className="p-2 bg-blue-50 rounded-lg">
								<FaLock className="w-5 h-5 text-blue-600" />
							</div>
							<h2 className="text-2xl font-semibold text-gray-900">
								Change Password
							</h2>
						</div>

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							{/* Current Password */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Current Password
								</label>
								<PasswordInput
									{...register("currentPassword", {
										required: "Current password is required",
									})}
									error={errors.currentPassword}
									placeholder="Enter your current password"
								/>
							</div>

							{/* New Password */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									New Password
								</label>
								<PasswordInput
									{...register("newPassword", {
										required: "Password is required",
										minLength: {
											value: 8,
											message: "Password must be at least 8 characters",
										},
										validate: {
											noSpaces: (value) =>
												value.trim() === value ||
												"Password must not start or end with spaces",
											complexity: (value) =>
												/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
													value
												) ||
												"Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
										},
									})}
									error={errors.newPassword}
									placeholder="Enter your new password"
								/>
							</div>

							{/* Confirm Password */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Confirm New Password
								</label>
								<PasswordInput
									{...register("confirmPassword", {
										required: "Please confirm your new password",
										validate: (value) =>
											value === getValues("newPassword") ||
											"The passwords do not match",
									})}
									error={errors.confirmPassword}
									placeholder="Confirm your new password"
								/>
							</div>

							{/* Password Requirements */}
							<PasswordRequirements password={newPassword} />

							{/* Submit Button */}
							<PrimaryButton
								type="submit"
								loading={loading}
								showChevron={false}
							>
								Change Password
								<FaLock className="w-4 h-4 ml-2" />
							</PrimaryButton>
						</form>
					</div>
				</div>
			</main>
		</div>
	);
};

export default PasswordChangeForm;
