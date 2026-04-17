import { useCallback } from 'react';
import axios from 'axios';
import useTripApiClient from './useTripApiClient';

export const useTripQueryApi = () => {
  const { tripsUrl, buildAuthHeaders } = useTripApiClient();

  const getTripById = useCallback(
    async (tripId, options = {}) => {
      const params = {};
      if (options.fields) {
        params.fields = Array.isArray(options.fields) ? options.fields.join(',') : options.fields;
      }

      return axios.get(`${tripsUrl}/${tripId}`, {
        params,
        headers: buildAuthHeaders()
      });
    },
    [buildAuthHeaders, tripsUrl]
  );

  const searchTrips = useCallback(
    async (filters = {}) => {
      return axios.post(
        `${tripsUrl}/Search`,
        { filters },
        {
          headers: buildAuthHeaders({ 'Content-Type': 'application/json' })
        }
      );
    },
    [buildAuthHeaders, tripsUrl]
  );

  const getAllTrips = useCallback(
    async (page = 1, limit = 10) => {
      return axios.get(`${tripsUrl}`, {
        params: { page, limit },
        headers: buildAuthHeaders()
      });
    },
    [buildAuthHeaders, tripsUrl]
  );

  const getLatestTrips = useCallback(
    async (limit = 5, fields = null) => {
      const params = {};
      if (fields) {
        params.fields = Array.isArray(fields) ? fields.join(',') : fields;
      }

      return axios.get(`${tripsUrl}/lasted/${limit}`, {
        params,
        headers: buildAuthHeaders()
      });
    },
    [buildAuthHeaders, tripsUrl]
  );

  return {
    getTripById,
    searchTrips,
    getAllTrips,
    getLatestTrips
  };
};

export default useTripQueryApi;
