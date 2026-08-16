import { useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

/**
 * Get authentication token from storage
 * @returns {string|null} Auth token or null if not found
 */
const getAuthToken = () => localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

/**
 * Create a standardized forbidden error
 * @returns {Error} Forbidden error with code
 */
const createForbiddenError = () => {
  const error = new Error('Only administrators can create or modify records.');
  error.code = 'FORBIDDEN';
  return error;
};

/**
 * useAuthenticatedApi - Reusable hook for API calls with admin authentication
 * 
 * This hook provides authenticated HTTP methods that automatically:
 * - Add Authorization Bearer token headers to all requests
 * - Enforce admin role for POST, PATCH, PUT, DELETE operations
 * - Handle authentication state from localStorage/sessionStorage
 * 
 * @returns {Object} API methods and admin status
 * @property {boolean} isAdmin - Whether current user has admin role
 * @property {Function} request - Generic axios request with auth headers
 * @property {Function} get - GET request (no admin check)
 * @property {Function} post - POST request (requires admin)
 * @property {Function} patch - PATCH request (requires admin)
 * @property {Function} put - PUT request (requires admin)
 * @property {Function} remove - DELETE request (requires admin)
 * 
 * @example
 * // Basic usage in a component
 * const { post, patch, isAdmin } = useAuthenticatedApi();
 * 
 * // Create a resource (admin only)
 * await post('/api/facilities', { name: 'WiFi', code: 'Wifi' });
 * 
 * // Update a resource (admin only)
 * await patch('/api/facilities/123', { name: 'Updated WiFi' });
 * 
 * // Get resources (any authenticated user)
 * const response = await get('/api/facilities');
 * 
 * @example
 * // Check admin status before rendering UI
 * const { isAdmin } = useAuthenticatedApi();
 * return isAdmin ? <AdminPanel /> : <AccessDenied />;
 */
export const useAuthenticatedApi = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('admin');

  /**
   * Build authentication headers with Bearer token
   * @param {Object} headers - Additional headers to merge
   * @returns {Object} Headers with Authorization token
   */
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

  /**
   * Generic authenticated request
   * @param {Object} requestConfig - Axios request configuration
   * @returns {Promise<AxiosResponse>} Axios response
   */
  const request = useCallback(
    (requestConfig = {}) =>
      axios({
        ...requestConfig,
        headers: buildAuthHeaders(requestConfig.headers),
        withCredentials: requestConfig.withCredentials ?? true
      }),
    [buildAuthHeaders]
  );

  /**
   * Ensure user has admin role, throw error if not
   * @throws {Error} Forbidden error if user is not admin
   */
  const ensureAdmin = useCallback(() => {
    if (!hasRole('admin')) {
      throw createForbiddenError();
    }
  }, [hasRole]);

  /**
   * GET request with authentication headers
   * No admin check - any authenticated user can read
   * @param {string} url - Request URL
   * @param {Object} config - Additional axios config
   * @returns {Promise<AxiosResponse>}
   */
  const get = useCallback((url, config = {}) => request({ ...config, method: 'get', url }), [request]);

  /**
   * POST request with admin authentication
   * @param {string} url - Request URL
   * @param {Object} data - Request payload
   * @param {Object} config - Additional axios config
   * @returns {Promise<AxiosResponse>}
   * @throws {Error} If user is not admin
   */
  const post = useCallback(
    (url, data, config = {}) => {
      ensureAdmin();
      return request({ ...config, method: 'post', url, data });
    },
    [ensureAdmin, request]
  );

  /**
   * PATCH request with admin authentication
   * @param {string} url - Request URL
   * @param {Object} data - Request payload
   * @param {Object} config - Additional axios config
   * @returns {Promise<AxiosResponse>}
   * @throws {Error} If user is not admin
   */
  const patch = useCallback(
    (url, data, config = {}) => {
      ensureAdmin();
      return request({ ...config, method: 'patch', url, data });
    },
    [ensureAdmin, request]
  );

  /**
   * PUT request with admin authentication
   * @param {string} url - Request URL
   * @param {Object} data - Request payload
   * @param {Object} config - Additional axios config
   * @returns {Promise<AxiosResponse>}
   * @throws {Error} If user is not admin
   */
  const put = useCallback(
    (url, data, config = {}) => {
      ensureAdmin();
      return request({ ...config, method: 'put', url, data });
    },
    [ensureAdmin, request]
  );

  /**
   * DELETE request with admin authentication
   * @param {string} url - Request URL
   * @param {Object} config - Additional axios config
   * @returns {Promise<AxiosResponse>}
   * @throws {Error} If user is not admin
   */
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