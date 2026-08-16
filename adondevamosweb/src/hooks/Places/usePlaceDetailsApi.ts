import { useCallback } from 'react';
import axios from 'axios';
import usePlaceApiClient from './usePlaceApiClient';

export const usePlaceDetailsApi = () => {
  const { placesUrl, buildAuthHeaders, getAuthToken } = usePlaceApiClient();

  const ensureToken = useCallback(() => {
    const token = getAuthToken();

    if (!token) {
      throw new Error('Authentication token is required');
    }
  }, [getAuthToken]);

  const getPlace = useCallback(
    async (placeId) => {
      return axios.get(`${placesUrl}/${placeId}`, {
        headers: buildAuthHeaders()
      });
    },
    [buildAuthHeaders, placesUrl]
  );

  const saveFacilities = useCallback(
    async (placeId, payload, method = 'put') => {
      ensureToken();
      const endpoint = `${placesUrl}/${placeId}/Facilities`;
      const headers = buildAuthHeaders({ 'Content-Type': 'application/json' });

      return method === 'post'
        ? axios.post(endpoint, payload, { headers })
        : axios.put(endpoint, payload, { headers });
    },
    [buildAuthHeaders, ensureToken, placesUrl]
  );

  const saveGalleryImages = useCallback(
    async (placeId, payload) => {
      ensureToken();
      return axios.post(`${placesUrl}/${placeId}/Images`, payload, {
        headers: buildAuthHeaders({ 'Content-Type': 'application/json' })
      });
    },
    [buildAuthHeaders, ensureToken, placesUrl]
  );

  const saveGalleryPhotos = useCallback(
    async (placeId, payload) => {
      ensureToken();
      return axios.post(`${placesUrl}/${placeId}/Photos`, payload, {
        headers: buildAuthHeaders({ 'Content-Type': 'application/json' })
      });
    },
    [buildAuthHeaders, ensureToken, placesUrl]
  );

  const removeGalleryImage = useCallback(
    async (placeId, imageId) => {
      ensureToken();
      return axios.delete(`${placesUrl}/${placeId}/Images/${imageId}`, {
        headers: buildAuthHeaders()
      });
    },
    [buildAuthHeaders, ensureToken, placesUrl]
  );

  const setCoverImage = useCallback(
    async (placeId, imageId) => {
      ensureToken();
      return axios.put(`${placesUrl}/${placeId}/Images/${imageId}/SetCover`, {}, {
        headers: buildAuthHeaders()
      });
    },
    [buildAuthHeaders, ensureToken, placesUrl]
  );

  return {
    getPlace,
    saveFacilities,
    saveGalleryImages,
    saveGalleryPhotos,
    removeGalleryImage,
    setCoverImage
  };
};

export default usePlaceDetailsApi;