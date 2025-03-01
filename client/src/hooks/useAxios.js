import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearTokens } from "../redux/authSlice";
import { toast } from "react-hot-toast";

const useAxios = () => {
	const { accessToken } = useSelector((state) => state.auth);
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
		(error) => {
			if (error.response && error.response.status === 403) {
				dispatch(clearTokens());
			} else if (
				error.response &&
				error.response.data.code === "user_inactive"
			) {
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
