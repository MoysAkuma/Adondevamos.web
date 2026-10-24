import { useState, useCallback } from 'react';
import useApi from '../useApi';
import config from '../../Resources/config';

const VERIFY_RESET_TOKEN_ENDPOINT = `${config.api.baseUrl}${config.api.endpoints.Users}/VerifyResetToken`;

/**
 * Hook for verifying password reset token
 * This does NOT require authentication (public endpoint)
 */
export const useVerifyResetTokenApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState(null);

  // Use useApi with requiresAuth = false (public endpoint)
  const { get } = useApi(false);

  const verifyToken = useCallback(async (token) => {
    setIsLoading(true);
    setError(null);
    setIsValid(false);
    setEmail(null);

    if (!token) {
      const message = 'Token is required';
      setError(message);
      setIsLoading(false);
      return { success: false, error: message };
    }

    try {
      const result = await get(`${VERIFY_RESET_TOKEN_ENDPOINT}?token=${token}`);

      if (result.success) {
        setIsValid(true);
        setEmail(result.data?.info?.email || result.data?.data?.email);
        return {
          success: true,
          valid: true,
          email: result.data?.info?.email || result.data?.data?.email
        };
      } else {
        setError(result.error);
        return { success: false, valid: false, error: result.error };
      }
    } catch (err) {
      const message = err.message || 'Failed to verify token';
      setError(message);
      return { success: false, valid: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [get]);

  const resetState = useCallback(() => {
    setError(null);
    setIsValid(false);
    setEmail(null);
  }, []);

  return {
    verifyToken,
    isLoading,
    error,
    isValid,
    email,
    resetState
  };
};

export default useVerifyResetTokenApi;
