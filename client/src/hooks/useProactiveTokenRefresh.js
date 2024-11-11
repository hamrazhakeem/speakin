import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setTokens, clearTokens } from "../redux/authSlice";

const useProactiveTokenRefresh = () => {
    const dispatch = useDispatch();
    const { refreshToken, userName, userId, isStudent, isAuthenticated, isAdmin, credits, isTutor, required_credits }= useSelector((state) => state.auth);
  
    useEffect(() => {
      const refreshTokens = async () => {
        if (refreshToken) {
          try {
            console.log('refreshToken before request', refreshToken)
            const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}token_refresh/`, {
                refresh: refreshToken,
              }
              );
            console.log(refreshToken)
            const { access, refresh } = response.data;
  
            // Update tokens in the store
            console.log('token updated', access, refresh);
            dispatch(setTokens({ accessToken: access, refreshToken: refresh, isAuthenticated, isAdmin, userName, userId, isStudent, credits, isTutor, required_credits }));
          } catch (error) {
            console.error('Error refreshing token:', error);
            if (error.response && error.response.status === 401) {
              console.log('Token expired, clearing tokens');
              dispatch(clearTokens());
            }
          }
        }
      };
      
      const interval = setInterval(refreshTokens, 2700000); // 45 minutes
      
      // Cleanup interval on component unmount
      return () => clearInterval(interval);

    }, [refreshToken, dispatch]);
  
    return null; 
  };
  
  export default useProactiveTokenRefresh;