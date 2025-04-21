import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setTokens, clearTokens } from "../redux/authSlice";
import { toast } from "react-hot-toast";

const useAxios = () => {
	const { accessToken, refreshToken, isAuthenticated, isAdmin, userName, userId, isStudent, credits, isTutor, required_credits } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	const instance = axios.create({
		baseURL: import.meta.env.VITE_API_GATEWAY_URL,
	});

	instance.interceptors.request.use(
		(config) => {
			if (accessToken) {
				config.headers["Authorization"] = `Bearer ${accessToken}`;
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	instance.interceptors.response.use(
		(response) => {
			return response;
		},
		async (error) => {
			const originalRequest = error.config;
			
			// Handle 401 Unauthorized errors - expired token
			if (error.response?.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true;
				
				if (!refreshToken) {
					dispatch(clearTokens());
					return Promise.reject(error);
				}
				
				try {
					// Attempt to refresh the token
					const response = await axios.post(
						`${import.meta.env.VITE_API_GATEWAY_URL}token/refresh/`,
						{ refresh: refreshToken }
					);
					
					const { access, refresh } = response.data;
					
					// Update tokens in Redux store
					dispatch(setTokens({
						accessToken: access,
						refreshToken: refresh,
						isAuthenticated,
						isAdmin,
						userName,
						userId,
						isStudent,
						credits,
						isTutor,
						required_credits
					}));
					
					// Retry the original request with new token
					originalRequest.headers["Authorization"] = `Bearer ${access}`;
					return instance(originalRequest);
				} catch (refreshError) {
					// If refresh fails, log out user
					dispatch(clearTokens());
					return Promise.reject(refreshError);
				}
			}
			
			// Handle 403 Forbidden errors
			if (error.response?.status === 403) {
				dispatch(clearTokens());
			} 
			// Handle deactivated user
			else if (error.response?.data?.code === "user_inactive") {
				toast.error(
					"Your account has been deactivated. Please contact the support for more info."
				);
				dispatch(clearTokens());
			}
			
			return Promise.reject(error);
		}
	);

	return instance;
};

export default useAxios;
