import { useCallback } from 'react';
import axios from 'axios';
import useTripApiClient from './useTripApiClient';

export const useTripsByOwnerApi = () => {
  const { tripsUrl, buildAuthHeaders } = useTripApiClient();

  type GetTripsByOwnerOptions = {
    action?: string;
    placeIds?: Array<string | number>;
  };

  const getTripsByOwner = useCallback(
    async (userId: string | number, page = 1, limit = 50, options: GetTripsByOwnerOptions = {}) => {
      const { action, placeIds = [] } = options;
      const normalizedPlaceIds = placeIds
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value > 0);

      return axios.get(`${tripsUrl}/owner/${userId}`, {
        params: {
          page,
          limit,
          ...(action ? { action } : {}),
          ...(normalizedPlaceIds.length > 0 ? { placeids: normalizedPlaceIds.join(',') } : {}),
        },
        headers: buildAuthHeaders()
      });
    },
    [buildAuthHeaders, tripsUrl]
  );

  return { getTripsByOwner };
};

export default useTripsByOwnerApi;
