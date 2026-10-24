import { useState, useCallback } from 'react';
import useApi from '../useApi';
import config from '../../Resources/config';

const RECOVER_PASSWORD_ENDPOINT = `${config.api.baseUrl}${config.api.endpoints.Users}/RecoverPassword`;

/**
 * Hook for password recovery (request reset link)
 * This does NOT require authentication (public endpoint)
 */
export const useRecoverPasswordApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Use useApi with requiresAuth = false (public endpoint)
  const { post } = useApi(false);

  const recoverPassword = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const trimmedEmail = email?.trim();

    if (!trimmedEmail) {
      const message = 'Email is required';
      setError(message);
      setIsLoading(false);
      return { success: false, error: message };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      const message = 'Please enter a valid email address';
      setError(message);
      setIsLoading(false);
      return { success: false, error: message };
    }

    try {
      const result = await post(RECOVER_PASSWORD_ENDPOINT, { email: trimmedEmail });

      if (result.success) {
        setSuccess(true);
        return {
          success: true,
          message: result.data?.message || 'Password recovery email sent successfully'
        };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const message = err.message || 'Failed to send recovery email';
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
    recoverPassword,
    isLoading,
    error,
    success,
    resetState
  };
};

export default useRecoverPasswordApi;
