import { useCallback, useState } from 'react';
import axios from 'axios';
import config from '../Resources/config';

const CHECK_AUTH_ENDPOINT = `${config.api.baseUrl}/check-auth`;

export const useCheckAuthApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get JWT token from session storage
      const token = sessionStorage.getItem('authToken');
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(
        CHECK_AUTH_ENDPOINT,
        {
          headers,
          withCredentials: true,
          timeout: 10000
        }
      );

      // Handle 304 Not Modified - session is still valid
      if (response.status === 304) {
        return {
          success: true,
          data: {
            isAuthenticated: true,
            status: 304
          }
        };
      }

      // Handle 200 OK with data
      if (response.data && response.data.info && response.data.info.isAuthenticated) {
        return {
          success: true,
          data: response.data.info
        };
      }

      return {
        success: false,
        message: 'Not authenticated'
      };
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError?.message || 'Auth check failed';
      setError(message);
      return {
        success: false,
        message,
        errorCode: requestError?.code
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetCheckAuthState = useCallback(() => {
    setError(null);
  }, []);

  return {
    checkAuth,
    isLoading,
    error,
    resetCheckAuthState
  };
};

export default useCheckAuthApi;
