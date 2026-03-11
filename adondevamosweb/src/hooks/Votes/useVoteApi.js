import { useCallback, useMemo } from 'react';
import axios from 'axios';
import config from '../../Resources/config';

export const useVoteApi = () => {
  const votesUrl = useMemo(
    () => `${config.api.baseUrl}${config.api.endpoints.Votes}`,
    []
  );

  const getAuthToken = useCallback(() => sessionStorage.getItem('authToken'), []);

  const buildAuthHeaders = useCallback((headers = {}) => {
    const token = getAuthToken();

    if (!token) {
      return headers;
    }

    return {
      ...headers,
      Authorization: `Bearer ${token}`
    };
  }, [getAuthToken]);

  const ensureAuthContext = useCallback((userId) => {
    const token = getAuthToken();

    if (!userId) {
      throw new Error('User is required to vote');
    }

    if (!token) {
      throw new Error('Authentication token is required to vote');
    }
  }, [getAuthToken]);

  const voteTrip = useCallback(async (tripId, userId) => {
    ensureAuthContext(userId);

    return axios.post(
      `${votesUrl}/${userId}`,
      { tripid: tripId },
      {
        headers: buildAuthHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }, [ensureAuthContext, votesUrl, buildAuthHeaders]);

  const votePlace = useCallback(async (placeId, userId) => {
    ensureAuthContext(userId);

    return axios.post(
      `${votesUrl}/${userId}`,
      { placeid: placeId },
      {
        headers: buildAuthHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }, [ensureAuthContext, votesUrl, buildAuthHeaders]);

  const getTripVotesSummary = useCallback(async (tripId) => {
    const response = await axios.get(`${votesUrl}/Trip/${tripId}`);
    return response?.data?.info?.summary || 0;
  }, [votesUrl]);

  const getPlaceVotesSummary = useCallback(async (placeId) => {
    const response = await axios.get(`${votesUrl}/Place/${placeId}`);
    return response?.data?.info?.summary || 0;
  }, [votesUrl]);

  return {
    voteTrip,
    votePlace,
    getTripVotesSummary,
    getPlaceVotesSummary,
    buildAuthHeaders,
    getAuthToken
  };
};

export default useVoteApi;
