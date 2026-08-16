import { useCallback } from 'react';
import axios from 'axios';
import useTripApiClient from './useTripApiClient';

export const useTripDetailsApi = () => {
  const { tripsUrl, buildAuthHeaders } = useTripApiClient();

  const saveItinerary = useCallback(
    async (tripId, payload, method = 'put') => {
      const endpoint = `${tripsUrl}/${tripId}/Itinerary`;
      const headers = buildAuthHeaders({ 'Content-Type': 'application/json' });

      return method === 'post'
        ? axios.post(endpoint, payload, { headers })
        : axios.put(endpoint, payload, { headers });
    },
    [buildAuthHeaders, tripsUrl]
  );

  const saveGallery = useCallback(
    async (tripId, payload) => {
      return axios.post(`${tripsUrl}/${tripId}/Images`, payload, {
        headers: buildAuthHeaders({
          'Content-Type': 'application/json'
        })
      });
    },
    [buildAuthHeaders, tripsUrl]
  );

  const removeGalleryImage = useCallback(
    async (tripId, imageId) => {
      return axios.delete(`${tripsUrl}/${tripId}/Images/${imageId}`, {
        headers: buildAuthHeaders()
      });
    },
    [buildAuthHeaders, tripsUrl]
  );

  const setCoverImage = useCallback(
    async (tripId, imageId) => {
      return axios.put(`${tripsUrl}/${tripId}/Images/${imageId}/SetCover`, {}, {
        headers: buildAuthHeaders()
      });
    },
    [buildAuthHeaders, tripsUrl]
  );

  const saveMembers = useCallback(
    async (tripId, payload, method = 'put') => {
      const endpoint = `${tripsUrl}/${tripId}/Members`;
      const headers = buildAuthHeaders({ 'Content-Type': 'application/json' });

      return method === 'post'
        ? axios.post(endpoint, payload, { headers })
        : axios.put(endpoint, payload, { headers });
    },
    [buildAuthHeaders, tripsUrl]
  );

  return {
    saveItinerary,
    saveGallery,
    removeGalleryImage,
    setCoverImage,
    saveMembers
  };
};

export default useTripDetailsApi;
