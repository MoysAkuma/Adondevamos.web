import React, { useState, useRef } from 'react';
import {
  Box,
  Avatar,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { PhotoCamera, Person } from '@mui/icons-material';
import useProfilePhotoUpload from '../../hooks/Users/useProfilePhotoUpload';

/**
 * ProfilePhotoUpload - Reusable component for uploading user profile photos
 * 
 * This component provides a UI for selecting and uploading profile photos.
 * It shows a preview of the selected image and handles upload state.
 * 
 * @param {Object} props - Component props
 * @param {string|number} props.userId - The ID of the user
 * @param {string} [props.currentPhotoUrl] - URL of current profile photo
 * @param {number} [props.size=120] - Size of the avatar in pixels
 * @param {Function} [props.onUploadSuccess] - Callback when upload succeeds
 * @param {Function} [props.onUploadError] - Callback when upload fails
 * @param {boolean} [props.showButton=true] - Whether to show upload button
 * @param {string} [props.buttonText='Upload Photo'] - Text for upload button
 * 
 * @example
 * // Basic usage
 * <ProfilePhotoUpload userId={user.id} />
 * 
 * @example
 * // With callbacks and custom size
 * <ProfilePhotoUpload 
 *   userId={user.id}
 *   currentPhotoUrl={user.photoUrl}
 *   size={150}
 *   onUploadSuccess={(data) => console.log('Uploaded!', data)}
 *   onUploadError={(error) => console.error('Failed:', error)}
 * />
 */
const ProfilePhotoUpload = ({
  userId,
  currentPhotoUrl,
  size = 120,
  onUploadSuccess,
  onUploadError,
  showButton = true,
  buttonText = 'Upload Photo'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [previewUrl, setPreviewUrl] = useState(currentPhotoUrl || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const fileInputRef = useRef(null);

  const { uploadPhoto, isUploading, error, success, resetState } = useProfilePhotoUpload(userId);

  /**
   * Handle file selection
   */
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    
    resetState();
  };

  /**
   * Handle upload button click
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a photo first');
      return;
    }

    try {
      const result = await uploadPhoto(selectedFile);
      setShowSnackbar(true);
      
      // Call success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
      
      // Clear selected file after successful upload
      setSelectedFile(null);
    } catch (err) {
      setShowSnackbar(true);
      
      // Call error callback if provided
      if (onUploadError) {
        onUploadError(err);
      }
    }
  };

  /**
   * Trigger file input click
   */
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Close snackbar
   */
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: 2
      }}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Avatar with photo */}
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={previewUrl}
          sx={{
            width: size,
            height: size,
            cursor: 'pointer',
            border: `3px solid ${theme.palette.primary.main}`,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
          onClick={handleAvatarClick}
        >
          {!previewUrl && <Person sx={{ fontSize: size * 0.6 }} />}
        </Avatar>

        {/* Camera icon button overlay */}
        <IconButton
          onClick={handleAvatarClick}
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark
            }
          }}
          size="small"
        >
          <PhotoCamera fontSize="small" />
        </IconButton>
      </Box>

      {/* Info text */}
      <Typography variant="caption" color="text.secondary" align="center">
        {selectedFile ? selectedFile.name : 'Click to select a photo'}
      </Typography>

      {/* Upload button */}
      {showButton && selectedFile && (
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={isUploading}
          startIcon={isUploading ? <CircularProgress size={20} /> : <PhotoCamera />}
          fullWidth={isMobile}
          sx={{ minWidth: 150 }}
        >
          {isUploading ? 'Uploading...' : buttonText}
        </Button>
      )}

      {/* Success/Error Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={success ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {success
            ? 'Profile photo uploaded successfully!'
            : error?.message || 'Failed to upload photo'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePhotoUpload;
