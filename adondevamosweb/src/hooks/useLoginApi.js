import { useCallback, useState } from 'react';
import axios from 'axios';
import config from '../Resources/config';

const LOGIN_ENDPOINT = `${config.api.baseUrl}/Login`;

export const useLoginApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async ({ username, password }) => {
    setIsLoading(true);
    setError(null);

    const normalizedUsername = username?.trim();

    if (!normalizedUsername || !password) {
      const message = 'Username and password are required';
      setError(message);
      setIsLoading(false);
      return { success: false, message };
    }

    try {
      const response = await axios.post(
        LOGIN_ENDPOINT,
        {
          id: normalizedUsername,
          password
        },
        {
          withCredentials: true,
          timeout: 10000
        }
      );
      
      const userInfo = response?.data?.info?.user;
      
      const token = response?.data?.info?.token;

      if (response.status === 200 && userInfo) {
        // Store JWT token in session storage if provided
        if (token) {
          sessionStorage.setItem('authToken', token);
        }
        
        return {
          success: true,
          data: userInfo,
          token
        };
      }

      const message = 'Login failed - no user info in response';
      console.log('Login failed:', message, 'Response data:', response.data);
      setError(message);
      return { success: false, message };
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetLoginState = useCallback(() => {
    setError(null);
  }, []);

  return {
    login,
    isLoading,
    error,
    resetLoginState
  };
};

export default useLoginApi;
