/**
 * AuthContext Usage Examples
 * 
 * This file demonstrates how to use the enhanced AuthContext features
 */

import { useAuth } from '../context/AuthContext';

// Example 1: Basic authentication check
function BasicAuthExample() {
  const { isLogged, user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {isLogged ? (
        <p>Welcome, {user}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}

// Example 2: Role-based rendering
function RoleBasedExample() {
  const { hasRole, role } = useAuth();
  
  return (
    <div>
      <h2>Your Role: {role}</h2>
      
      {hasRole('user') && (
        <button>Basic User Action</button>
      )}
      
      {hasRole('moderator') && (
        <button>Moderate Content</button>
      )}
      
      {hasRole('admin') && (
        <button>Admin Panel</button>
      )}
      
      {hasRole('superadmin') && (
        <button>Super Admin Settings</button>
      )}
    </div>
  );
}

// Example 3: Permission-based rendering
function PermissionBasedExample() {
  const { hasPermission } = useAuth();
  
  return (
    <div>
      {hasPermission('read') && (
        <button>View Content</button>
      )}
      
      {hasPermission('write') && (
        <button>Create Content</button>
      )}
      
      {hasPermission('delete') && (
        <button>Delete Content</button>
      )}
      
      {hasPermission('manage_users') && (
        <button>Manage Users</button>
      )}
      
      {hasPermission('manage_site') && (
        <button>Site Settings</button>
      )}
    </div>
  );
}

// Example 4: Handling authentication errors
function ErrorHandlingExample() {
  const { authError, isLogged } = useAuth();
  
  return (
    <div>
      {authError && (
        <div className="error-banner">
          <strong>Authentication Error:</strong> {authError}
        </div>
      )}
      
      {isLogged && <p>You are authenticated</p>}
    </div>
  );
}

// Example 5: Manual session extension
function SessionExtensionExample() {
  const { sessionWarning, extendSession, logout } = useAuth();
  
  return (
    <div>
      {sessionWarning && (
        <div className="warning-banner">
          <p>Your session is about to expire!</p>
          <button onClick={extendSession}>Stay Logged In</button>
          <button onClick={() => logout()}>Logout</button>
        </div>
      )}
    </div>
  );
}

// Example 6: Login with error handling
function LoginFormExample() {
  const { login, loading, authError } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(credentials.username, credentials.password);
    
    if (result.success) {
      // Redirect or show success message
      console.log('Login successful!');
    } else {
      // Error is automatically set in authError
      console.error('Login failed:', result.message);
    }
  };
  
  return (
    <form onSubmit={handleLogin}>
      {authError && <div className="error">{authError}</div>}
      
      <input
        type="text"
        value={credentials.username}
        onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
        placeholder="Username"
        disabled={loading}
      />
      
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
        placeholder="Password"
        disabled={loading}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// Example 7: Protected route with role requirement
/*
In App.js:
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminPanel />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/moderator" 
  element={
    <ProtectedRoute requiredRole="moderator">
      <ModeratorPanel />
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
*/

export {
  BasicAuthExample,
  RoleBasedExample,
  PermissionBasedExample,
  ErrorHandlingExample,
  SessionExtensionExample,
  LoginFormExample
};
