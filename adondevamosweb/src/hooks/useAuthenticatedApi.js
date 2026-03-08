import { useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const getAuthToken = () => localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

const createForbiddenError = () => {
  const error = new Error('Only administrators can create or modify records.');
  error.code = 'FORBIDDEN';
  return error;
};

export const useAuthenticatedApi = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('admin');

  const buildAuthHeaders = useCallback((headers = {}) => {
    const token = getAuthToken();

    if (!token) {
      return headers;
    }

    return {
      ...headers,
      Authorization: `Bearer ${token}`
    };
  }, []);

  const request = useCallback(
    (requestConfig = {}) =>
      axios({
        ...requestConfig,
        headers: buildAuthHeaders(requestConfig.headers),
        withCredentials: requestConfig.withCredentials ?? true
      }),
    [buildAuthHeaders]
  );

  const ensureAdmin = useCallback(() => {
    if (!hasRole('admin')) {
      throw createForbiddenError();
    }
  }, [hasRole]);

  const get = useCallback((url, config = {}) => request({ ...config, method: 'get', url }), [request]);

  const post = useCallback(
    (url, data, config = {}) => {
      ensureAdmin();
      return request({ ...config, method: 'post', url, data });
    },
    [ensureAdmin, request]
  );

  const patch = useCallback(
    (url, data, config = {}) => {
      ensureAdmin();
      return request({ ...config, method: 'patch', url, data });
    },
    [ensureAdmin, request]
  );

  const put = useCallback(
    (url, data, config = {}) => {
      ensureAdmin();
      return request({ ...config, method: 'put', url, data });
    },
    [ensureAdmin, request]
  );

  const remove = useCallback(
    (url, config = {}) => {
      ensureAdmin();
      return request({ ...config, method: 'delete', url });
    },
    [ensureAdmin, request]
  );

  return {
    isAdmin,
    request,
    get,
    post,
    patch,
    put,
    remove
  };
};

export default useAuthenticatedApi;