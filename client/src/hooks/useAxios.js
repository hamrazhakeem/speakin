import axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { clearTokens } from '../redux/authSlice';
import { toast } from 'react-toastify';

const useAxios = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_URL,
  });

  instance.interceptors.request.use(
    (config) => {
      if (accessToken){
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        console.log('access token sent', accessToken)
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response; // Pass through the successful response
    },
    (error) => {
      if (error.response && error.response.data.code === "user_inactive") {
        dispatch(clearTokens());
        toast.error("Your account has been deactivated. Please contact the support for more info.");
      }
      return Promise.reject(error); // Forward the error for further handling
    }
  );

  return instance;
};

export default useAxios;