import React from 'react';
import { Box, CircularProgress, Alert, AlertTitle } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole, requiredPermission }) => {
  const { isLogged, loading, hasRole, hasPermission, authError } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isLogged && !loading) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          p: 3
        }}
      >
        <Alert severity="error">
          <AlertTitle>Access Denied</AlertTitle>
          You don't have permission to access this page. Required role: {requiredRole}
        </Alert>
      </Box>
    );
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          p: 3
        }}
      >
        <Alert severity="error">
          <AlertTitle>Access Denied</AlertTitle>
          You don't have the required permission to access this page.
        </Alert>
      </Box>
    );
  }

  // Show auth error if present
  if (authError) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          p: 3
        }}
      >
        <Alert severity="warning">
          <AlertTitle>Authentication Warning</AlertTitle>
          {authError}
        </Alert>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
