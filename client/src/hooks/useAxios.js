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

// import axios from 'axios';
// import { useSelector, useDispatch } from 'react-redux';
// import { clearTokens, setAccessToken, setRefreshToken } from '../redux/authSlice';
// import { toast } from 'react-toastify';

// const useAxios = () => {
//   const accessToken = useSelector((state) => state.auth.accessToken);
//   const dispatch = useDispatch();

//   const instance = axios.create({
//     baseURL: import.meta.env.VITE_API_GATEWAY_URL,
//     withCredentials: true, // Ensures cookies (e.g., refresh token) are included
//   });

//   instance.interceptors.request.use(
//     (config) => {
//       if (accessToken) {
//         config.headers['Authorization'] = `Bearer ${accessToken}`;
//         console.log('Access token sent:', accessToken);
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   instance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config;

//       if (error.response && error.response.data.code === "user_inactive") {
//         dispatch(clearTokens());
//         toast.error("Your account has been deactivated. Please contact support.");
//         return Promise.reject(error);
//       }

//       if (error.response && error.response.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;

//         try {
//           const response = await axios.post(
//             `${import.meta.env.VITE_API_GATEWAY_URL}/auth/refresh-token`,
//             {},
//             { withCredentials: true }
//           );

//           const newAccessToken = response.data.access_token;
//           const newRefreshToken = response.data.refresh_token;

//           dispatch(setAccessToken(newAccessToken));
//           if (newRefreshToken) {
//             dispatch(setRefreshToken(newRefreshToken)); // Save new refresh token if provided
//           }

//           instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
//           originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//           return instance(originalRequest);
//         } catch (refreshError) {
//           dispatch(clearTokens());
//           toast.error("Session expired. Please log in again.");
//           return Promise.reject(refreshError);
//         }
//       }

//       return Promise.reject(error);
//     }
//   );

//   return instance;
// };

// export default useAxios;
