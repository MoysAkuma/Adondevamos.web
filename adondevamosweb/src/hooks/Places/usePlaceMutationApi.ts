import { useCallback } from 'react';
import axios from 'axios';
import usePlaceApiClient from './usePlaceApiClient';

export const usePlaceMutationApi = () => {
  const { placesUrl, buildAuthHeaders, getAuthToken } = usePlaceApiClient();

  const createPlace = useCallback(
    async (payload) => {
      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication token is required to create a place');
      }

      return axios.post(placesUrl, payload, {
        headers: buildAuthHeaders({
          'Content-Type': 'application/json'
        })
      });
    },
    [buildAuthHeaders, getAuthToken, placesUrl]
  );

  const updatePlace = useCallback(
    async (placeId, payload) => {
      const token = getAuthToken();

      if (!token) {
        throw new Error('Authentication token is required to update a place');
      }

      return axios.put(`${placesUrl}/${placeId}`, payload, {
        headers: buildAuthHeaders({
          'Content-Type': 'application/json'
        })
      });
    },
    [buildAuthHeaders, getAuthToken, placesUrl]
  );

  return {
    placesUrl,
    buildAuthHeaders,
    createPlace,
    updatePlace
  };
};

export default usePlaceMutationApi;