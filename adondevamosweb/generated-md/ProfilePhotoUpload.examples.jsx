/**
 * ProfilePhotoUpload - Usage Examples
 * 
 * This file demonstrates how to use the ProfilePhotoUpload component
 * in various scenarios within your application.
 */

import React from 'react';
import ProfilePhotoUpload from '../Component/Users/ProfilePhotoUpload';
import { useAuth } from '../context/AuthContext';

// ============================================================================
// Example 1: Basic Usage in EditUser Component
// ============================================================================

const EditUserExample = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Edit Profile</h1>
      
      {/* Basic usage - just provide userId */}
      <ProfilePhotoUpload userId={user.id} />
      
      {/* Rest of your edit form */}
    </div>
  );
};

// ============================================================================
// Example 2: With Current Photo URL
// ============================================================================

const ProfilePageExample = () => {
  const { user } = useAuth();

  return (
    <div>
      <ProfilePhotoUpload 
        userId={user.id}
        currentPhotoUrl={user.profilePhotoUrl}
      />
    </div>
  );
};

// ============================================================================
// Example 3: With Callbacks and Custom Size
// ============================================================================

const CustomExample = () => {
  const { user } = useAuth();

  const handleUploadSuccess = (data) => {
    console.log('Upload successful!', data);
    // Refresh user data, update UI, etc.
  };

  const handleUploadError = (error) => {
    console.error('Upload failed:', error);
    // Show error notification, log error, etc.
  };

  return (
    <div>
      <ProfilePhotoUpload 
        userId={user.id}
        currentPhotoUrl={user.profilePhotoUrl}
        size={150}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
      />
    </div>
  );
};

// ============================================================================
// Example 4: Without Upload Button (Auto-upload on select)
// ============================================================================

const AutoUploadExample = () => {
  const { user } = useAuth();

  return (
    <div>
      <ProfilePhotoUpload 
        userId={user.id}
        showButton={false}  // Hide the upload button
        // Photo will upload automatically when selected
      />
    </div>
  );
};

// ============================================================================
// Example 5: Custom Button Text
// ============================================================================

const CustomButtonExample = () => {
  const { user } = useAuth();

  return (
    <div>
      <ProfilePhotoUpload 
        userId={user.id}
        buttonText="Save Profile Picture"
      />
    </div>
  );
};

// ============================================================================
// Example 6: Integration in EditUser Page
// ============================================================================

const EditUserIntegrationExample = () => {
  const { user } = useAuth();
  const [formData, setFormData] = React.useState({
    name: user.name,
    email: user.email,
    // ... other fields
  });

  const handlePhotoUploadSuccess = (data) => {
    // Optionally refresh user data or update state
    console.log('Profile photo updated:', data);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Submit other form data
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      
      {/* Profile Photo Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Profile Photo</h2>
        <ProfilePhotoUpload 
          userId={user.id}
          currentPhotoUrl={user.profilePhotoUrl}
          onUploadSuccess={handlePhotoUploadSuccess}
        />
      </section>

      {/* Other Form Fields */}
      <form onSubmit={handleFormSubmit}>
        {/* Your existing form fields */}
        <input 
          type="text" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        {/* ... more fields */}
        
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

// ============================================================================
// Example 7: Using with Material-UI Card Layout
// ============================================================================

import { Card, CardContent, Typography, Box } from '@mui/material';

const MaterialUIExample = () => {
  const { user } = useAuth();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Profile Settings
        </Typography>
        
        <Box sx={{ mt: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Profile Photo
          </Typography>
          <ProfilePhotoUpload 
            userId={user.id}
            currentPhotoUrl={user.profilePhotoUrl}
            size={150}
          />
        </Box>

        {/* Other profile settings */}
      </CardContent>
    </Card>
  );
};

export {
  EditUserExample,
  ProfilePageExample,
  CustomExample,
  AutoUploadExample,
  CustomButtonExample,
  EditUserIntegrationExample,
  MaterialUIExample
};
