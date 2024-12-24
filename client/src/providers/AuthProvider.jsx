import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setTokens, clearTokens } from "../redux/authSlice";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { refreshToken, userName, userId, isStudent, isAuthenticated, isAdmin, credits, isTutor, required_credits } = useSelector((state) => state.auth);

  const refreshTokenRef = useRef(refreshToken);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Update the refreshToken ref whenever it changes in the Redux store
    refreshTokenRef.current = refreshToken;
  }, [refreshToken]);

  useEffect(() => {
    if (!isAuthenticated || !refreshTokenRef.current) {
      setLoading(false); // No need to refresh token if not authenticated
      return;
    }

    const refreshTokens = async () => {
      try {
        console.log('refreshToken before request', refreshTokenRef.current);
        const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}token/refresh/`, {
          refresh: refreshTokenRef.current,
        });
        const { access, refresh } = response.data;
        // Update tokens in the store
        console.log('token updated', access, refresh);
        dispatch(setTokens({ accessToken: access, refreshToken: refresh, isAuthenticated, isAdmin, userName, userId, isStudent, credits, isTutor, required_credits }));
        setLoading(false); // Finished refreshing tokens
      } catch (error) {
        console.log('Failed to refresh token:', error);
        dispatch(clearTokens());
        setLoading(false); // Finished, even if there was an error
      }
    };

    refreshTokens();

    const interval = setInterval(refreshTokens, 10 * 60 * 1000); // 10 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(interval);

  }, [dispatch, isAuthenticated]);

  // Show a loading screen until the tokens are refreshed
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