import { useState, useCallback } from 'react';
import axios from 'axios';
import config from '../../Resources/config';

/**
 * Get authentication token from storage
 * @returns {string|null} Auth token or null if not found
 */
const getAuthToken = () => localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

/**
 * Read file as base64 data URL
 * @param {File} file - File to read
 * @returns {Promise<string>} Base64 encoded data URL
 */
const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

/**
 * useProfilePhotoUpload - Custom hook for uploading user profile photos
 * 
 * This hook handles profile photo uploads to the 'users/profile' endpoint.
 * It automatically includes authentication token and user ID in headers,
 * and sends the image data in the request body.
 * 
 * @param {string|number} userId - The ID of the user
 * @returns {Object} Upload function and state
 * @property {Function} uploadPhoto - Function to upload a photo file
 * @property {boolean} isUploading - Whether upload is in progress
 * @property {Error|null} error - Error object if upload failed
 * @property {boolean} success - Whether upload succeeded
 * @property {Function} resetState - Reset state to initial values
 * 
 * @example
 * const { uploadPhoto, isUploading, error, success } = useProfilePhotoUpload(userId);
 * 
 * // Upload a photo file
 * await uploadPhoto(fileObject);
 */
const useProfilePhotoUpload = (userId) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Upload profile photo
   * @param {File} file - Image file to upload
   * @returns {Promise<Object>} Upload response data
   */
  const uploadPhoto = useCallback(async (file) => {
    if (!file) {
      const error = new Error('No file provided');
      setError(error);
      throw error;
    }

    if (!userId) {
      const error = new Error('User ID is required');
      setError(error);
      throw error;
    }

    const token = getAuthToken();
    if (!token) {
      const error = new Error('Authentication token not found');
      setError(error);
      throw error;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      // Read file as base64 data URL
      const imageData = await readFileAsDataUrl(file);
      
      // Extract mimetype from file or default to image/jpeg
      const mimetype = file.type || 'image/jpeg';
      
      // Extract file extension
      const extension = file.name ? file.name.split('.').pop() : 'jpg';

      // Prepare payload
      const payload = {
        data: imageData,
        mimetype: mimetype,
        extension: extension
      };

      // Make POST request
      const response = await axios.post(
        `${config.api.baseUrl}${config.api.endpoints.Users}/${userId}/ProfilePhoto`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-User-Id': userId,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      setSuccess(true);
      setIsUploading(false);
      
      return response.data;
    } catch (err) {
      console.error('Error uploading profile photo:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload profile photo';
      const uploadError = new Error(errorMessage);
      setError(uploadError);
      setIsUploading(false);
      throw uploadError;
    }
  }, [userId]);

  /**
   * Reset state to initial values
   */
  const resetState = useCallback(() => {
    setIsUploading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    uploadPhoto,
    isUploading,
    error,
    success,
    resetState
  };
};

export default useProfilePhotoUpload;
