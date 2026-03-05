import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import useTripApiClient from './useTripApiClient';

export const useLastedTrips = (limit = 3, options = {}) => {
  const {
    enabled = true,
    includeUserHeader = false,
    userId = null
  } = options;

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { tripsUrl, buildAuthHeaders } = useTripApiClient();

  const fetchLastedTrips = useCallback(async () => {
    if (!enabled) {
      setTrips([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers = {};

      if (includeUserHeader && userId) {
        headers['user-id'] = userId;
      }

      const response = await axios.get(`${tripsUrl}/lasted/${limit}`, {
        headers: buildAuthHeaders(headers)
      });

      setTrips(response?.data?.info || []);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to fetch lasted trips');
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, includeUserHeader, userId, tripsUrl, limit, buildAuthHeaders]);

  useEffect(() => {
    fetchLastedTrips();
  }, [fetchLastedTrips]);

  return {
    trips,
    setTrips,
    loading,
    error,
    refetchLastedTrips: fetchLastedTrips
  };
};

export default useLastedTrips;
