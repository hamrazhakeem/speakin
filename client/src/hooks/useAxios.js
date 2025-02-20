import axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { clearTokens } from '../redux/authSlice';
import { toast } from 'react-hot-toast';

const useAxios = () => {
  const { accessToken, refreshToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_URL,
  });

  instance.interceptors.request.use(
    (config) => {
      if (accessToken){
        config.headers['Authorization'] = `Bearer ${accessToken}`;

        console.log('access token sent', accessToken, refreshToken)
      }
      return config;
    },
    (error) => {
      console.log(error)
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response; 
    },
    (error) => {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });

      if (error.response && error.response.status === 403) {
        console.warn('Authentication failed: Token expired or invalid');
        dispatch(clearTokens());
      }
      else if (error.response && error.response.data.code === "user_inactive") {
        console.error('User account deactivated:', error.response.data);
        toast.error("Your account has been deactivated. Please contact the support for more info.");
        dispatch(clearTokens());
      }
      return Promise.reject(error); 
    }
  );

  return instance;
};

export default useAxios;
