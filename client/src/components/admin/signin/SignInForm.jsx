import React, { useState } from "react";
import { Shield, AlertCircle, Lock, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { setTokens } from "../../../redux/authSlice";
import { adminApi } from "../../../api/adminApi";
import AdminButton from "../ui/AdminButton";
import FormInput from "../ui/FormInput";
import AlertBox from "../ui/AlertBox";
import LogoBadge from "../ui/LogoBadge";

const SignInForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const axiosInstance = useAxios();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await adminApi.signIn(axiosInstance, {
				email,
				password,
			});
			const { access, refresh, name, id } = response;

			dispatch(
				setTokens({
					accessToken: access,
					refreshToken: refresh,
					userName: name,
					userId: id,
					isAdmin: true,
				})
			);

			toast.success("Welcome back, Admin!");
			navigate("/admin/dashboard");
		} catch (error) {
			const message =
				error.response?.data?.detail || "Login failed. Please try again.";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 sm:px-6">
			<div className="w-full max-w-md">
				<LogoBadge
					icon={Shield}
					title="Admin Portal"
					subtitle="Access the SpeakIn administration panel"
					className="mb-8"
				/>

				<AlertBox
					icon={AlertCircle}
					message="This area is restricted to authorized administrators only. All actions are logged for security purposes."
					className="mb-6"
				/>

				<div className="bg-black border border-zinc-800 rounded-xl p-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						<FormInput
							label="Admin Email"
							type="email"
							icon={Mail}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>

						<FormInput
							label="Password"
							type="password"
							icon={Lock}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>

						<AdminButton
							type="submit"
							loading={loading}
							className="w-full"
							loadingText="Signing in..."
						>
							Sign In
						</AdminButton>
					</form>
				</div>

				{/* Footer */}
				<div className="mt-6 text-center">
					<p className="text-sm text-zinc-500">
						Protected by SpeakIn security monitoring
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignInForm;
