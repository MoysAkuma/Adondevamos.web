import { useCallback } from 'react';
import axios from 'axios';
import useTripApiClient from './useTripApiClient';

export const useTripMutationApi = () => {
  const { tripsUrl, buildAuthHeaders } = useTripApiClient();

  const createTrip = useCallback(
    async (payload) => {
      const response = await axios.post(tripsUrl, payload, {
        headers: buildAuthHeaders({
          'Content-Type': 'application/json'
        })
      });

      return response;
    },
    [buildAuthHeaders, tripsUrl]
  );

  const updateTrip = useCallback(
    async (tripId, payload) => {
      const response = await axios.put(`${tripsUrl}/${tripId}`, payload, {
        headers: buildAuthHeaders({
          'Content-Type': 'application/json'
        })
      });

      return response;
    },
    [buildAuthHeaders, tripsUrl]
  );

  const getTrip = useCallback(
    async (tripId) => {
      const response = await axios.get(`${tripsUrl}/${tripId}`, {
        headers: buildAuthHeaders()
      });

      return response;
    },
    [buildAuthHeaders, tripsUrl]
  );

  return {
    createTrip,
    updateTrip,
    getTrip
  };
};

export default useTripMutationApi;
