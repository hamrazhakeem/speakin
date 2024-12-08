import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setTokens, clearTokens } from "../redux/authSlice";

const useProactiveTokenRefresh = () => {
    const dispatch = useDispatch();
    const { refreshToken, userName, userId, isStudent, isAuthenticated, isAdmin, credits, isTutor, required_credits }= useSelector((state) => state.auth);
  
    useEffect(() => {
      if (!isAuthenticated || !refreshToken) return;

      const refreshTokens = async () => {
        try {
          console.log('refreshToken before request', refreshToken)
          const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}token/refresh/`, {
              refresh: refreshToken,
            }
          );
          const { access, refresh } = response.data;
          // Update tokens in the store
          console.log('token updated', access, refresh);
          dispatch(setTokens({ accessToken: access, refreshToken: refresh, isAuthenticated, isAdmin, userName, userId, isStudent, credits, isTutor, required_credits }));
        } catch (error) {
          console.log('Failed to refresh token:', error);
          dispatch(clearTokens());
        }
      };
      
      const interval = setInterval(refreshTokens, 10 * 60 * 1000); // 5 minutes
      
      // Cleanup interval on component unmount
      return () => clearInterval(interval);

    }, [dispatch, refreshToken]);
  
    return null; 
  };
  
  export default useProactiveTokenRefresh;