import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import useTripApiClient from './useTripApiClient';

export const useTripById = (tripId, options = {}) => {
  const {
    enabled = true,
    includeUserHeader = false,
    userId = null
  } = options;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [tripInfo, setTripInfo] = useState(null);
  const { tripsUrl, buildAuthHeaders } = useTripApiClient();

  const fetchTrip = useCallback(async () => {
    if (!enabled || !tripId) {
      setLoading(false);
      setError(null);
      setNotFound(false);
      setTripInfo(null);
      return;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const headers = {};
      if (includeUserHeader && userId) {
        headers['user-id'] = userId;
      }

      const response = await axios.get(`${tripsUrl}/${tripId}`, {
        headers: buildAuthHeaders(headers)
      });
      setTripInfo(response?.data?.info || null);
    } catch (requestError) {
      if (requestError?.response?.status === 404) {
        setNotFound(true);
        setTripInfo(null);
      } else {
        setError(requestError?.response?.data?.message || 'Failed to fetch trip information');
      }
    } finally {
      setLoading(false);
    }
  }, [enabled, includeUserHeader, tripId, tripsUrl, userId, buildAuthHeaders]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  return {
    tripInfo,
    setTripInfo,
    loading,
    error,
    notFound,
    refetchTrip: fetchTrip
  };
};

export default useTripById;
