import { useCallback, useState } from 'react';
import axios from 'axios';
import config from '../Resources/config';

const LOGOUT_ENDPOINT = `${config.api.baseUrl}/Logout`;

export const useLogoutApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get JWT token from session storage
      const token = sessionStorage.getItem('authToken');
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await axios.post(
        LOGOUT_ENDPOINT,
        {},
        {
          headers,
          withCredentials: true,
          timeout: 5000
        }
      );

      // Clear JWT token from session storage on successful logout
      sessionStorage.removeItem('authToken');

      return {
        success: true
      };
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError?.message || 'Logout failed';
      setError(message);
      // Clear JWT token even if logout API fails
      sessionStorage.removeItem('authToken');
      // Still return success for logout since we'll clear local state anyway
      return {
        success: true,
        warning: message
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetLogoutState = useCallback(() => {
    setError(null);
  }, []);

  return {
    logout,
    isLoading,
    error,
    resetLogoutState
  };
};

export default useLogoutApi;
