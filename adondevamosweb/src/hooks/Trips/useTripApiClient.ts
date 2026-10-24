import { useCallback, useMemo } from 'react';
import config from '../../Resources/config';

export const useTripApiClient = () => {
  const tripsUrl = useMemo(
    () => `${config.api.baseUrl}${config.api.endpoints.Trips}`,
    []
  );

  const buildAuthHeaders = useCallback((headers = {}) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (!token) {
      return headers;
    }

    return {
      ...headers,
      Authorization: `Bearer ${token}`
    };
  }, []);

  return {
    tripsUrl,
    buildAuthHeaders
  };
};

export default useTripApiClient;
