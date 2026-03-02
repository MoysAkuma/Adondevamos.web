import { useMemo, useCallback } from 'react';
import config from '../../Resources/config';

export const usePlaceApiClient = () => {
  const placesUrl = useMemo(
    () => `${config.api.baseUrl}${config.api.endpoints.Places}`,
    []
  );

  const buildAuthHeaders = useCallback((headers = {}) => {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
      return headers;
    }

    return {
      ...headers,
      Authorization: `Bearer ${token}`
    };
  }, []);

  const getAuthToken = useCallback(() => sessionStorage.getItem('authToken'), []);

  return {
    placesUrl,
    buildAuthHeaders,
    getAuthToken
  };
};

export default usePlaceApiClient;