import { useCallback } from 'react';
import axios from 'axios';
import useTripApiClient from './useTripApiClient';

export const useTripsByOwnerApi = () => {
  const { tripsUrl, buildAuthHeaders } = useTripApiClient();

  const getTripsByOwner = useCallback(
    async (userId: string | number, page = 1, limit = 50) => {
      return axios.get(`${tripsUrl}/owner/${userId}`, {
        params: { page, limit },
        headers: buildAuthHeaders()
      });
    },
    [buildAuthHeaders, tripsUrl]
  );

  return { getTripsByOwner };
};

export default useTripsByOwnerApi;
