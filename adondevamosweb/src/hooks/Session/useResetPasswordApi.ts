import { useState, useCallback } from 'react';
import useApi from '../useApi';
import config from '../../Resources/config';

const RESET_PASSWORD_ENDPOINT = `${config.api.baseUrl}${config.api.endpoints.Users}/ResetPassword`;

/**
 * Hook for resetting password with token
 * This does NOT require authentication (public endpoint)
 */
export const useResetPasswordApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Use useApi with requiresAuth = false (public endpoint)
  const { post } = useApi(false);

  const resetPassword = useCallback(async (token, newPassword) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (!token || !newPassword) {
      const message = 'Token and new password are required';
      setError(message);
      setIsLoading(false);
      return { success: false, error: message };
    }

    if (newPassword.length < 6) {
      const message = 'Password must be at least 6 characters long';
      setError(message);
      setIsLoading(false);
      return { success: false, error: message };
    }

    try {
      const result = await post(RESET_PASSWORD_ENDPOINT, { token, newPassword });

      if (result.success) {
        setSuccess(true);
        return {
          success: true,
          message: result.data?.message || 'Password reset successfully'
        };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const message = err.message || 'Failed to reset password';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [post]);

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    resetPassword,
    isLoading,
    error,
    success,
    resetState
  };
};

export default useResetPasswordApi;
