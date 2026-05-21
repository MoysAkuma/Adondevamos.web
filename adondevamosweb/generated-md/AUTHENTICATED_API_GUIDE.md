# Authenticated API Hook Guide

## Overview
The `useAuthenticatedApi` hook provides a reusable way to make API calls with automatic admin authentication headers. It handles Bearer token management, role-based access control, and standardized error handling.

## Features
- ✅ Automatic Authorization Bearer token headers
- ✅ Admin role enforcement for mutations (POST, PATCH, PUT, DELETE)
- ✅ Token retrieval from localStorage/sessionStorage
- ✅ Standardized error handling
- ✅ Read access (GET) for all authenticated users
- ✅ Type-safe request methods

## Installation
Already included in the project at `src/hooks/useAuthenticatedApi.js`

## Basic Usage

### Import the Hook
```javascript
import useAuthenticatedApi from '../../hooks/useAuthenticatedApi';
```

### Using in a Component
```javascript
function MyComponent() {
  const { post, patch, get, remove, isAdmin } = useAuthenticatedApi();
  
  // Check if user is admin
  if (!isAdmin) {
    return <div>Access Denied</div>;
  }
  
  const handleCreate = async () => {
    try {
      const response = await post('/api/facilities', {
        name: 'WiFi',
        code: 'Wifi',
        enabled: true
      });
      console.log('Created:', response.data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  
  return <button onClick={handleCreate}>Create Facility</button>;
}
```

## Available Methods

### `get(url, config)`
**Purpose:** Fetch data from the API  
**Admin Required:** ❌ No (any authenticated user)  
**Parameters:**
- `url` (string): API endpoint
- `config` (object, optional): Additional axios configuration

**Example:**
```javascript
const { get } = useAuthenticatedApi();

const fetchFacilities = async () => {
  const response = await get(`${baseUrl}/facilities`);
  return response.data;
};
```

### `post(url, data, config)`
**Purpose:** Create new resources  
**Admin Required:** ✅ Yes  
**Parameters:**
- `url` (string): API endpoint
- `data` (object): Request payload
- `config` (object, optional): Additional axios configuration

**Example:**
```javascript
const { post } = useAuthenticatedApi();

const createFacility = async (facilityData) => {
  const response = await post(`${baseUrl}/facilities`, facilityData);
  return response.data;
};
```

### `patch(url, data, config)`
**Purpose:** Partially update existing resources  
**Admin Required:** ✅ Yes  
**Parameters:**
- `url` (string): API endpoint
- `data` (object): Fields to update
- `config` (object, optional): Additional axios configuration

**Example:**
```javascript
const { patch } = useAuthenticatedApi();

const updateFacility = async (id, updates) => {
  const response = await patch(`${baseUrl}/facilities/${id}`, updates);
  return response.data;
};
```

### `put(url, data, config)`
**Purpose:** Fully replace existing resources  
**Admin Required:** ✅ Yes  
**Parameters:**
- `url` (string): API endpoint
- `data` (object): Complete resource data
- `config` (object, optional): Additional axios configuration

**Example:**
```javascript
const { put } = useAuthenticatedApi();

const replaceFacility = async (id, fullData) => {
  const response = await put(`${baseUrl}/facilities/${id}`, fullData);
  return response.data;
};
```

### `remove(url, config)`
**Purpose:** Delete resources  
**Admin Required:** ✅ Yes  
**Parameters:**
- `url` (string): API endpoint
- `config` (object, optional): Additional axios configuration

**Example:**
```javascript
const { remove } = useAuthenticatedApi();

const deleteFacility = async (id) => {
  await remove(`${baseUrl}/facilities/${id}`);
};
```

### `request(requestConfig)`
**Purpose:** Generic custom request  
**Admin Required:** ❌ No (depends on usage)  
**Parameters:**
- `requestConfig` (object): Full axios request configuration

**Example:**
```javascript
const { request } = useAuthenticatedApi();

const customRequest = async () => {
  const response = await request({
    method: 'GET',
    url: '/api/custom-endpoint',
    params: { filter: 'active' }
  });
  return response.data;
};
```

## Properties

### `isAdmin` (boolean)
Returns whether the current user has admin role.

**Example:**
```javascript
const { isAdmin } = useAuthenticatedApi();

return (
  <div>
    {isAdmin && <AdminPanel />}
    {!isAdmin && <AccessDenied />}
  </div>
);
```

## Complete Component Example

```javascript
import React, { useState } from 'react';
import { Button, TextField, Alert } from '@mui/material';
import useAuthenticatedApi from '../../hooks/useAuthenticatedApi';
import config from '../../Resources/config';

function FacilityForm({ id, onSuccess }) {
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { post, patch, isAdmin } = useAuthenticatedApi();
  const baseUrl = `${config.api.baseUrl}${config.api.endpoints.Catalogues}/facility`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (id) {
        // Update existing facility
        await patch(`${baseUrl}/${id}`, formData);
      } else {
        // Create new facility
        await post(baseUrl, formData);
      }
      
      setFormData({ name: '', code: '' });
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <Alert severity="error">Admin access required</Alert>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert severity="error">{error}</Alert>}
      
      <TextField
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      
      <TextField
        label="Code"
        value={formData.code}
        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
        required
      />
      
      <Button type="submit" disabled={loading}>
        {id ? 'Update' : 'Create'} Facility
      </Button>
    </form>
  );
}

export default FacilityForm;
```

## Error Handling

### Admin Permission Error
When a non-admin user tries to use POST, PATCH, PUT, or DELETE:
```javascript
try {
  await post('/api/facilities', data);
} catch (error) {
  if (error.code === 'FORBIDDEN') {
    console.error('Admin access required:', error.message);
    // "Only administrators can create or modify records."
  }
}
```

### Network/API Errors
```javascript
try {
  await post('/api/facilities', data);
} catch (error) {
  const message = error.response?.data?.message || error.message;
  console.error('API Error:', message);
}
```

## Authentication Flow

1. Hook checks for JWT token in `localStorage` or `sessionStorage`
2. Token is added to request headers as `Authorization: Bearer <token>`
3. For mutation methods (POST, PATCH, PUT, DELETE), admin role is verified
4. If user is not admin, a `FORBIDDEN` error is thrown before making the request
5. Request is sent with authentication headers and `withCredentials: true`

## Migration Guide

### Before (Direct axios)
```javascript
import axios from 'axios';

const createFacility = async (data) => {
  const token = localStorage.getItem('authToken');
  await axios.post('/api/facilities', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
```

### After (useAuthenticatedApi)
```javascript
import useAuthenticatedApi from '../../hooks/useAuthenticatedApi';

function MyComponent() {
  const { post } = useAuthenticatedApi();
  
  const createFacility = async (data) => {
    await post('/api/facilities', data);
  };
}
```

## Best Practices

1. **Always check `isAdmin` before rendering admin UI**
   ```javascript
   const { isAdmin } = useAuthenticatedApi();
   return isAdmin ? <AdminForm /> : <AccessDenied />;
   ```

2. **Handle errors gracefully**
   ```javascript
   try {
     await post(url, data);
   } catch (error) {
     setErrorMessage(error.response?.data?.message || error.message);
   }
   ```

3. **Use loading states**
   ```javascript
   const [loading, setLoading] = useState(false);
   
   const handleSubmit = async () => {
     setLoading(true);
     try {
       await post(url, data);
     } finally {
       setLoading(false);
     }
   };
   ```

4. **Destructure only what you need**
   ```javascript
   // Good
   const { post, isAdmin } = useAuthenticatedApi();
   
   // Avoid
   const api = useAuthenticatedApi();
   api.post(...);
   ```

## Related Files
- Hook Implementation: `src/hooks/useAuthenticatedApi.js`
- Auth Context: `src/context/AuthContext.js`
- Example Usage: `src/Component/ManagmentSite/FormFacility.jsx`

## Support & Troubleshooting

### Token not found
- Ensure user is logged in
- Check localStorage/sessionStorage for 'authToken' key
- Verify token is set during login process

### Forbidden errors on GET requests
- GET requests don't require admin
- Check if token is expired or invalid
- Verify authentication is working

### Admin check failing
- Verify user role is 'admin' in auth context
- Check `hasRole('admin')` returns true
- Ensure role data is loaded from server
