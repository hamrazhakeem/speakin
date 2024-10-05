import axios from 'axios';
import { useSelector } from 'react-redux';

const useAxios = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_URL,
  });

  instance.interceptors.request.use(
    (config) => {
      if (accessToken){
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxios;