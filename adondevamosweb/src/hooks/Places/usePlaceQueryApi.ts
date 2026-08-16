import { useCallback } from 'react';
import axios from 'axios';
import usePlaceApiClient from './usePlaceApiClient';

export const usePlaceQueryApi = () => {
  const { placesUrl, buildAuthHeaders } = usePlaceApiClient();

  const getPlace = useCallback(
    async (placeId, options = {}) => {
      const headers = { ...options.headers };

      if (options.userId) {
        headers['user-id'] = options.userId;
      }

      return axios.get(`${placesUrl}/${placeId}`, {
        headers: buildAuthHeaders(headers)
      });
    },
    [buildAuthHeaders, placesUrl]
  );

  const searchPlaces = useCallback(
    async (filters = []) => {
      return axios.post(
        `${placesUrl}/Search`,
        { filters },
        {
          headers: buildAuthHeaders({ 'Content-Type': 'application/json' })
        }
      );
    },
    [buildAuthHeaders, placesUrl]
  );

  const searchPlacesByName = useCallback(
    async (name) => {
      return axios.get(`${placesUrl}/Search/name/${name}`, {
        headers: buildAuthHeaders()
      });
    },
    [buildAuthHeaders, placesUrl]
  );

  const getLatestPlaces = useCallback(
    async (limit = 3) => {
      return axios.get(`${placesUrl}/lasted/${limit}`, {
        headers: buildAuthHeaders()
      });
    },
    [buildAuthHeaders, placesUrl]
  );

  const getUbicationNames = useCallback(
    async ({ countryid, stateid, cityid }) => {
      return axios.get(
        `${placesUrl}/Ubications/${countryid}/${stateid}/${cityid}`,
        {
          headers: buildAuthHeaders()
        }
      );
    },
    [buildAuthHeaders, placesUrl]
  );

  return {
    getPlace,
    searchPlaces,
    searchPlacesByName,
    getLatestPlaces,
    getUbicationNames
  };
};

export default usePlaceQueryApi;