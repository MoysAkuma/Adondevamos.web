import { useCallback } from 'react';
import axios from 'axios';

/**
 * Generic API hook for making HTTP requests
 * This is a base hook that can be used by other specific API hooks
 * 
 * @param {boolean} requiresAuth - Whether this API call requires authentication
 * @returns {object} API request methods
 */
export const useApi = (requiresAuth = false) => {
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }, []);

  const buildHeaders = useCallback((customHeaders = {}) => {
    const headers = { ...customHeaders };
    
    if (requiresAuth) {
      const token = getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return headers;
  }, [requiresAuth, getAuthToken]);

  const request = useCallback(async (config) => {
    const {
      method = 'GET',
      url,
      data,
      headers = {},
      timeout = 10000,
      ...restConfig
    } = config;

    try {
      const response = await axios({
        method,
        url,
        data,
        headers: buildHeaders(headers),
        timeout,
        withCredentials: requiresAuth, // Only send credentials if auth is required
        ...restConfig
      });

      return {
        success: true,
        data: response.data,
        status: response.status,
        response
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Request failed';
      
      return {
        success: false,
        error: errorMessage,
        status: error.response?.status,
        response: error.response
      };
    }
  }, [buildHeaders, requiresAuth]);

  const get = useCallback((url, config = {}) => {
    return request({ method: 'GET', url, ...config });
  }, [request]);

  const post = useCallback((url, data, config = {}) => {
    return request({ method: 'POST', url, data, ...config });
  }, [request]);

  const put = useCallback((url, data, config = {}) => {
    return request({ method: 'PUT', url, data, ...config });
  }, [request]);

  const patch = useCallback((url, data, config = {}) => {
    return request({ method: 'PATCH', url, data, ...config });
  }, [request]);

  const del = useCallback((url, config = {}) => {
    return request({ method: 'DELETE', url, ...config });
  }, [request]);

  return {
    request,
    get,
    post,
    put,
    patch,
    delete: del
  };
};

export default useApi;
