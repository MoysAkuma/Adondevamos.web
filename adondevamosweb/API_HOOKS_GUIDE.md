# API Hooks Documentation

## Overview
Reusable React hooks for all API calls in the AdondeVamos application. These hooks provide a clean, type-safe way to interact with the backend API.

## Base Hook

### `useApi(requiresAuth = false)`
**Location:** `src/hooks/useApi.js`

The foundation hook for all API calls. Handles authentication headers and error handling.

**Parameters:**
- `requiresAuth` (boolean): Whether the endpoint requires authentication

**Returns:**
```javascript
{
  request: (config) => Promise,
  get: (url, config) => Promise,
  post: (url, data, config) => Promise,
  put: (url, data, config) => Promise,
  patch: (url, data, config) => Promise,
  delete: (url, config) => Promise
}
```

**Example:**
```javascript
const { post } = useApi(false); // Public endpoint
const result = await post('/Users/RecoverPassword', { email: 'user@example.com' });
```

## Session/Authentication Hooks

### `useRecoverPasswordApi()`
**Location:** `src/hooks/Session/useRecoverPasswordApi.js`

Request a password reset link to be sent to the user's email.

**API Endpoint:** `POST /Users/RecoverPassword`
**Requires Auth:** No

**Returns:**
```javascript
{
  recoverPassword: (email) => Promise<{ success, message, error }>,
  isLoading: boolean,
  error: string | null,
  success: boolean,
  resetState: () => void
}
```

**Usage Example:**
```javascript
import useRecoverPasswordApi from '../hooks/Session/useRecoverPasswordApi';

function RecoverPasswordForm() {
  const { recoverPassword, isLoading, error, success } = useRecoverPasswordApi();

  const handleSubmit = async (email) => {
    const result = await recoverPassword(email);
    
    if (result.success) {
      console.log('Email sent!');
    } else {
      console.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  );
}
```

### `useResetPasswordApi()`
**Location:** `src/hooks/Session/useResetPasswordApi.js`

Reset user password using a valid reset token.

**API Endpoint:** `POST /Users/ResetPassword`
**Requires Auth:** No

**Returns:**
```javascript
{
  resetPassword: (token, newPassword) => Promise<{ success, message, error }>,
  isLoading: boolean,
  error: string | null,
  success: boolean,
  resetState: () => void
}
```

**Usage Example:**
```javascript
import useResetPasswordApi from '../hooks/Session/useResetPasswordApi';

function ResetPasswordForm({ token }) {
  const { resetPassword, isLoading, success } = useResetPasswordApi();
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await resetPassword(token, newPassword);
    
    if (result.success) {
      // Redirect to login
      navigate('/Login');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  );
}
```

### `useVerifyResetTokenApi()`
**Location:** `src/hooks/Session/useVerifyResetTokenApi.js`

Verify if a password reset token is valid and not expired.

**API Endpoint:** `GET /Users/VerifyResetToken?token={token}`
**Requires Auth:** No

**Returns:**
```javascript
{
  verifyToken: (token) => Promise<{ success, valid, email, error }>,
  isLoading: boolean,
  error: string | null,
  isValid: boolean,
  email: string | null,
  resetState: () => void
}
```

**Usage Example:**
```javascript
import useVerifyResetTokenApi from '../hooks/Session/useVerifyResetTokenApi';
import { useEffect } from 'react';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyToken, isLoading, isValid, email } = useVerifyResetTokenApi();

  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token, verifyToken]);

  if (isLoading) return <div>Verifying...</div>;
  if (!isValid) return <div>Invalid or expired token</div>;

  return (
    <div>
      <p>Reset password for: {email}</p>
      {/* Reset form */}
    </div>
  );
}
```

### `useLoginApi()`
**Location:** `src/hooks/Session/useLoginApi.js`

Existing hook for user login.

**API Endpoint:** `POST /Login`
**Requires Auth:** No

### `useLogoutApi()`
**Location:** `src/hooks/Session/useLogoutApi.js`

Existing hook for user logout.

**API Endpoint:** `POST /Logout`
**Requires Auth:** Yes

### `useCheckAuthApi()`
**Location:** `src/hooks/Session/useCheckAuthApi.js`

Existing hook to check if user is authenticated.

**API Endpoint:** `GET /check-auth`
**Requires Auth:** Yes

## Pattern for Creating New API Hooks

When creating new API hooks, follow this pattern:

```javascript
import { useState, useCallback } from 'react';
import useApi from '../useApi';
import config from '../../Resources/config';

const ENDPOINT = `${config.api.baseUrl}${config.api.endpoints.YourEndpoint}`;

export const useYourApiHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // requiresAuth = true if endpoint needs authentication
  const { post } = useApi(false);

  const yourMethod = useCallback(async (params) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await post(ENDPOINT, params);

      if (result.success) {
        setData(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const message = err.message || 'Request failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [post]);

  const resetState = useCallback(() => {
    setError(null);
    setData(null);
  }, []);

  return {
    yourMethod,
    isLoading,
    error,
    data,
    resetState
  };
};

export default useYourApiHook;
```

## Key Benefits

1. **Consistent Error Handling**: All hooks handle errors uniformly
2. **Loading States**: Built-in loading state management
3. **Authentication**: Automatic auth token injection when needed
4. **No Credential Issues**: Only sends `withCredentials: true` when authentication is required
5. **Reusable**: Easy to create new hooks following the same pattern
6. **Type Safety**: Clear return types and parameters
7. **State Management**: Tracks loading, error, and success states

## Fixed Issues

### Password Recovery Logout Bug
**Problem:** RecoverPassword component was sending `withCredentials: true` for a public endpoint, causing authentication conflicts.

**Solution:** Created `useApi` with `requiresAuth` parameter. Password recovery hooks use `useApi(false)`, which doesn't send credentials.

**Before:**
```javascript
await axios.post(url, data, { withCredentials: true }); // Always sent credentials
```

**After:**
```javascript
const { post } = useApi(false); // No credentials for public endpoints
await post(url, data);
```

## Route Configuration

The password reset page is accessible at `/reset-password`:

```javascript
// App.js
<Route path="/reset-password" element={<ResetPassword/>}/>
```

Users receive an email with a link like:
```
https://yoursite.com/reset-password?token=550e8400-e29b-41d4-a716-446655440000
```

## Complete Flow

1. **User requests password reset**
   - Opens RecoverPassword modal
   - Enters email
   - `useRecoverPasswordApi().recoverPassword(email)` is called
   - Email sent with reset link

2. **User clicks email link**
   - Opens `/reset-password?token=xyz`
   - ResetPassword page loads
   - `useVerifyResetTokenApi().verifyToken(token)` validates token
   - If valid, shows reset form

3. **User submits new password**
   - `useResetPasswordApi().resetPassword(token, newPassword)` is called
   - Password updated in database
   - Token deleted
   - User redirected to login page

4. **User logs in with new password**
   - Uses `useLoginApi().login()` as normal

## Testing

All hooks can be tested independently:

```javascript
// Test recover password
const { recoverPassword } = useRecoverPasswordApi();
await recoverPassword('test@example.com');

// Test verify token
const { verifyToken } = useVerifyResetTokenApi();
await verifyToken('550e8400-e29b-41d4-a716-446655440000');

// Test reset password
const { resetPassword } = useResetPasswordApi();
await resetPassword('550e8400-e29b-41d4-a716-446655440000', 'newPassword123');
```
