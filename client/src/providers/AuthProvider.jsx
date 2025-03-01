import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setTokens, clearTokens } from "../redux/authSlice";
import LoadingSpinner from "../components/common/ui/LoadingSpinner";

const AuthProvider = ({ children }) => {
	const dispatch = useDispatch();
	const {
		refreshToken,
		userName,
		userId,
		isStudent,
		isAuthenticated,
		isAdmin,
		credits,
		isTutor,
		required_credits,
	} = useSelector((state) => state.auth);

	const refreshTokenRef = useRef(refreshToken);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		refreshTokenRef.current = refreshToken;
	}, [refreshToken]);

	useEffect(() => {
		if (!isAuthenticated || !refreshTokenRef.current) {
			setLoading(false);
			return;
		}

		const refreshTokens = async () => {
			try {
				const response = await axios.post(
					`${import.meta.env.VITE_API_GATEWAY_URL}token/refresh/`,
					{
						refresh: refreshTokenRef.current,
					}
				);
				const { access, refresh } = response.data;
				dispatch(
					setTokens({
						accessToken: access,
						refreshToken: refresh,
						isAuthenticated,
						isAdmin,
						userName,
						userId,
						isStudent,
						credits,
						isTutor,
						required_credits,
					})
				);
				setLoading(false);
			} catch (error) {
				dispatch(clearTokens());
				setLoading(false);
			}
		};

		refreshTokens();

		const interval = setInterval(refreshTokens, 10 * 60 * 1000);

		return () => clearInterval(interval);
	}, [dispatch, isAuthenticated]);

	if (loading) {
		return (
			<div className="fixed inset-0 flex items-center justify-center min-h-screen">
				<LoadingSpinner size="lg" className="text-blue-600" />
			</div>
		);
	}

	return children;
};

export default AuthProvider;
