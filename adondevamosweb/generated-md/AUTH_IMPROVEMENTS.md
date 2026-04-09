# AuthContext Improvements Documentation

## Overview
The AuthContext has been significantly enhanced with better user validation, security features, and developer experience improvements.

## Key Improvements

### 1. **Session Management**
- **Automatic Token Refresh**: Sessions are automatically validated every 15 minutes
- **Idle Timeout Detection**: 30-minute inactivity timeout with 5-minute warning
- **Session Warning Dialog**: Users are warned before automatic logout
- **Cross-Tab Synchronization**: Login/logout state syncs across browser tabs
- **Activity Tracking**: Mouse, keyboard, scroll, and touch events reset the timeout

### 2. **Enhanced Security**
- **Input Validation**: All user inputs are validated before API calls
- **Data Integrity Checks**: Backend responses are validated against stored data
- **Automatic Session Cleanup**: Sessions are cleared on authentication failures
- **Network Error Resilience**: Temporary session preservation on network errors
- **Logout Propagation**: Logout events notify all open tabs

### 3. **Role-Based Access Control (RBAC)**

#### Role Hierarchy
```javascript
superadmin (level 4) - Full system access
admin (level 3) - User and content management
moderator (level 2) - Content management
user (level 1) - Basic access
```

#### Permission System
```javascript
superadmin: ['read', 'write', 'delete', 'manage_users', 'manage_site']
admin: ['read', 'write', 'delete', 'manage_users']
moderator: ['read', 'write', 'delete']
user: ['read', 'write']
```

### 4. **Improved Error Handling**
- **Detailed Error States**: `authError` state for displaying errors to users
- **Network Error Recovery**: Graceful handling of network timeouts
- **Comprehensive Error Messages**: Clear, actionable error messages
- **Loading States**: Proper loading indicators during async operations

### 5. **Developer Experience**
- **TypeScript-Ready**: Better type inference for hooks
- **useAuth Hook**: Centralized hook with error handling
- **Helper Functions**: `hasRole()` and `hasPermission()` utilities
- **Example Documentation**: Comprehensive usage examples provided

## New API Methods

### Context Values
```javascript
const {
  user,              // Current user ID
  usertag,          // User tag/username
  role,             // User role (admin, moderator, user)
  isLogged,         // Boolean: is user authenticated
  loading,          // Boolean: auth check in progress
  authError,        // String: current authentication error
  sessionWarning,   // Boolean: session about to expire
  login,            // Function: (username, password) => Promise
  logout,           // Function: (reason?) => Promise
  checkAuthStatus,  // Function: () => Promise
  hasRole,          // Function: (role) => boolean
  hasPermission,    // Function: (permission) => boolean
  extendSession     // Function: () => void
} = useAuth();
```

## Usage Examples

### Basic Authentication
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { isLogged, user, loading } = useAuth();
  
  if (loading) return <CircularProgress />;
  
  return isLogged ? <Dashboard /> : <Login />;
}
```

### Role-Based Rendering
```jsx
function AdminPanel() {
  const { hasRole } = useAuth();
  
  return (
    <div>
      {hasRole('moderator') && <ModerateButton />}
      {hasRole('admin') && <AdminControls />}
      {hasRole('superadmin') && <SystemSettings />}
    </div>
  );
}
```

### Permission-Based Features
```jsx
function ContentEditor() {
  const { hasPermission } = useAuth();
  
  return (
    <div>
      {hasPermission('write') && <CreateButton />}
      {hasPermission('delete') && <DeleteButton />}
      {hasPermission('manage_site') && <SettingsButton />}
    </div>
  );
}
```

### Protected Routes with Roles
```jsx
// In App.js
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminPanel />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/settings" 
  element={
    <ProtectedRoute requiredPermission="manage_site">
      <SiteSettings />
    </ProtectedRoute>
  } 
/>
```

### Login with Error Handling
```jsx
function LoginForm() {
  const { login, authError, loading } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    
    if (result.success) {
      navigate('/dashboard');
    }
    // Error automatically shown via authError state
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {authError && <Alert severity="error">{authError}</Alert>}
      {/* Form fields */}
    </form>
  );
}
```

## Components Added

### 1. SessionWarning Component
- Displays modal dialog when session is about to expire
- Shows countdown timer with progress bar
- Allows users to extend session or logout
- Automatically logs out when timer reaches zero

### 2. Enhanced ProtectedRoute Component
- Supports `requiredRole` prop for role-based access
- Supports `requiredPermission` prop for permission-based access
- Shows meaningful error messages for unauthorized access
- Preserves intended destination for post-login redirect

## Configuration Constants

Located at the top of `AuthContext.js`:
```javascript
SESSION_TIMEOUT = 30 * 60 * 1000;        // 30 minutes
SESSION_WARNING_TIME = 5 * 60 * 1000;    // 5 minutes before timeout
TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes
```

Adjust these values based on your security requirements.

## Migration Guide

### Existing Code Compatibility
The improvements are **backward compatible**. Existing code will continue to work without changes.

### Recommended Updates

1. **Add SessionWarning to App.js**
```jsx
import SessionWarning from './Component/Commons/SessionWarning';

function AppContent() {
  return (
    <>
      <AppBar />
      <SessionWarning />  {/* Add this */}
      <Routes>{/* ... */}</Routes>
    </>
  );
}
```

2. **Add Role Requirements to Protected Routes**
```jsx
// Before
<ProtectedRoute><ManageSite/></ProtectedRoute>

// After
<ProtectedRoute requiredRole="admin"><ManageSite/></ProtectedRoute>
```

3. **Update Login to Use authError**
```jsx
// Before
const { login } = useAuth();

// After
const { login, authError } = useAuth();
// Then display authError in UI
```

## Security Considerations

1. **Session Timeouts**: Adjust timeout values based on your security needs
2. **Role Validation**: Always validate roles on the backend as well
3. **Token Storage**: Tokens are stored in localStorage (consider httpOnly cookies for production)
4. **HTTPS Required**: Always use HTTPS in production
5. **Backend Validation**: Frontend checks are convenience - always validate on backend

## Testing Recommendations

1. Test session timeout by setting short timeout values
2. Test cross-tab logout by opening multiple tabs
3. Test role-based access with different user roles
4. Test network error scenarios by disconnecting internet
5. Test session extension by interacting during warning period

## Future Enhancements

Consider implementing:
- JWT token-based authentication
- Refresh token rotation
- Two-factor authentication (2FA)
- Remember me functionality
- Password strength requirements
- Account lockout after failed attempts
- Audit logging for authentication events

## Troubleshooting

### Session expires too quickly
- Increase `SESSION_TIMEOUT` constant
- Check backend session timeout settings
- Verify activity events are firing

### Role checks not working
- Verify role names match exactly (case-sensitive)
- Check role hierarchy in `hasRole` function
- Ensure backend sends correct role data

### Cross-tab sync issues
- Check localStorage is enabled
- Verify browser supports storage events
- Check for browser extensions blocking storage

## Support

For issues or questions, refer to:
- AuthContext.js source code
- AuthContextExamples.js for usage patterns
- This documentation

---

**Version**: 2.0  
**Last Updated**: January 16, 2026  
**Compatibility**: React 17+, React Router 6+, MUI 5+
