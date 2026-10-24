import { useCallback, useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import useTripApiClient from './useTripApiClient';

export const useLastedTrips = (limit = 3, options = {}) => {
  const {
    enabled = true,
    includeUserHeader = false,
    userId = null,
    fields = null // Optional: array of fields to fetch ['owner', 'itinerary', 'gallery', 'statics', 'userVoted']
  } = options;

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { tripsUrl, buildAuthHeaders } = useTripApiClient();

  // Stabilize fields array to prevent infinite loops
  const fieldsString = useMemo(() => {
    if (!fields || !Array.isArray(fields) || fields.length === 0) return null;
    return fields.sort().join(','); // Sort to ensure consistent string even if order changes
  }, [JSON.stringify(fields)]);

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

      // Build query params
      let url = `${tripsUrl}/lasted/${limit}`;
      if (fieldsString) {
        url += `?fields=${fieldsString}`;
      }

      const response = await axios.get(url, {
        headers: buildAuthHeaders(headers)
      });

      setTrips(response?.data?.info || []);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to fetch lasted trips');
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, includeUserHeader, userId, tripsUrl, limit, fieldsString, buildAuthHeaders]);

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
