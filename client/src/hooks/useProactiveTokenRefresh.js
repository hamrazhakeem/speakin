import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setTokens, clearTokens } from "../redux/authSlice";

const useProactiveTokenRefresh = () => {
    const dispatch = useDispatch();
    const refreshToken = useSelector((state) => state.auth.refreshToken);
  
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
            dispatch(setTokens({ accessToken: access, refreshToken: refresh, isAdmin: true, isAuthenticated: true }));
          } catch (error) {
            console.error('Error refreshing token:', error);
            dispatch(clearTokens()); // Clear tokens if refresh fails
          }
        }
      };
      
      
      // Refresh the tokens every 4 minutes (240,000 milliseconds)
      const interval = setInterval(refreshTokens, 2700000 ); // 45 minutes
      
      // Cleanup interval on component unmount
      return () => clearInterval(interval);

      

    }, [refreshToken, dispatch]);
  
    return null; 
  };
  
  export default useProactiveTokenRefresh;