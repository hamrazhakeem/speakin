import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTokens } from "../../../../redux/authSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { studentApi } from "../../../../api/studentApi";

// Component imports
import SignInWithGoogleButton from "./SignInWithGoogleButton";
import LoadingSpinner from "../../../common/ui/LoadingSpinner";
import { useForm } from "react-hook-form";
import FormInput from "../../common/ui/input/FormInput";
import PasswordInput from "../../common/ui/input/PasswordInput";
import UserTypeSelector from "../../common/ui/signin/UserTypeSelector";
import PrimaryButton from "../../common/ui/buttons/PrimaryButton";

const SignInForm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data) => {
		setIsLoading(true);
		try {
			const response = await studentApi.signIn(axios, data);
			const { access, refresh, name, id, credits } = response;

			dispatch(
				setTokens({
					accessToken: access,
					refreshToken: refresh,
					userName: name,
					userId: id,
					isAdmin: false,
					isStudent: true,
					isTutor: false,
					credits: credits,
				})
			);

			toast.success(`Welcome, ${name}!`);
			navigate("/home");
		} catch (error) {
			const message =
				error.response?.data?.detail || "Login failed. Please try again.";
			toast.error(message);
			console.error("Login failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex-1 flex justify-center items-center p-4 bg-gray-50 min-h-[calc(100vh-4rem-4rem)]">
			<div className="w-full max-w-md">
				<div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mt-10 mb-10">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Welcome Back
						</h1>
						<p className="text-gray-600">Sign in to your SpeakIn account</p>
					</div>

					<UserTypeSelector selectedType="student" />

					<div className="mb-6">
						<SignInWithGoogleButton />
					</div>

					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-200"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-gray-500">
								or continue with email
							</span>
						</div>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div>
							<FormInput
								type="email"
								placeholder="Email address"
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: "Invalid email address",
									},
								})}
								error={errors.email}
							/>
						</div>

						<div>
							<PasswordInput
								{...register("password", {
									required: "Password is required",
								})}
								error={errors.password}
							/>
						</div>

						<PrimaryButton
							type="submit"
							disabled={isLoading}
							className="w-full"
							loading={isLoading}
						>
							{isLoading ? (
								<div className="h-5 flex items-center">
									<LoadingSpinner size="sm" />
								</div>
							) : (
								<>Sign In</>
							)}
						</PrimaryButton>
					</form>

					<div className="mt-6 space-y-4">
						<Link
							to="/forgot-password"
							className="block text-center text-blue-600 hover:text-blue-700"
						>
							Forgot password?
						</Link>
						<div className="text-center text-gray-600">
							Don't have an account?{" "}
							<Link
								to="/sign-up"
								className="text-blue-600 hover:text-blue-700 font-medium"
							>
								Sign up
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignInForm;
