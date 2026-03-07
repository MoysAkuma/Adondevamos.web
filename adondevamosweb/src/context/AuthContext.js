import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import useLoginApi from '../hooks/Session/useLoginApi';
import useCheckAuthApi from '../hooks/Session/useCheckAuthApi';
import useLogoutApi from '../hooks/Session/useLogoutApi';

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  checkAuthStatus: () => false,
  hasRole: () => false,
  hasPermission: () => false
});

// Constants for session management
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const SESSION_WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout
const TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes
const MIN_AUTH_CHECK_INTERVAL = 10000; // 10 seconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [usertag, setUserTag] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [sessionWarning, setSessionWarning] = useState(false);
  
  // Refs for timers
  const sessionTimeoutRef = useRef(null);
  const sessionWarningRef = useRef(null);
  const refreshIntervalRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const isCheckingAuthRef = useRef(false);
  const lastAuthCheckRef = useRef(0);
  const checkAuthStatusRef = useRef(null);
  const clearAllStateRef = useRef(null);
  const hasInitializedRef = useRef(false);
  
  // API hooks
  const { login: loginRequest } = useLoginApi();
  const { checkAuth: checkAuthRequest } = useCheckAuthApi();
  const { logout: logoutRequest } = useLogoutApi();

  // Clear all session timers
  const clearSessionTimers = useCallback(() => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
    if (sessionWarningRef.current) {
      clearTimeout(sessionWarningRef.current);
      sessionWarningRef.current = null;
    }
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    setSessionWarning(false);
  }, []);

  // Reset session timeout on activity
  const resetSessionTimeout = useCallback(() => {
    lastActivityRef.current = Date.now();
    clearSessionTimers();
    
    if (isLogged) {
      // Set warning timer
      sessionWarningRef.current = setTimeout(() => {
        setSessionWarning(true);
      }, SESSION_TIMEOUT - SESSION_WARNING_TIME);
      
      // Set logout timer
      sessionTimeoutRef.current = setTimeout(() => {
        logout('Session expired due to inactivity');
      }, SESSION_TIMEOUT);
    }
  }, [isLogged]);

  // Track user activity
  useEffect(() => {
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      if (isLogged && Date.now() - lastActivityRef.current > 60000) { // Only reset if 1 min has passed
        resetSessionTimeout();
      }
    };
    
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });
    
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isLogged, resetSessionTimeout]);

  // Clear all authentication state
  const clearAllState = useCallback(() => {
    localStorage.removeItem('userid');
    localStorage.removeItem('tag');
    localStorage.removeItem('role');
    localStorage.removeItem('localSession');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    setUser(null);
    setUserTag(null);
    setRole(null);
    setIsLogged(false);
    setAuthError(null);
    clearSessionTimers();
  }, [clearSessionTimers]);

  const checkAuthStatus = useCallback(async (force = false) => {
    const now = Date.now();

    // Always respect in-progress check - even with force
    if (isCheckingAuthRef.current) {
      return { success: false, message: 'Auth check already in progress' };
    }

    // Cooldown check - force bypasses time check but not in-progress
    if (!force && now - lastAuthCheckRef.current < MIN_AUTH_CHECK_INTERVAL) {
      return { success: true, skipped: true };
    }

    lastAuthCheckRef.current = now;
    isCheckingAuthRef.current = true;
    setLoading(true);
    setAuthError(null);
    const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const isSession = localStorage.getItem('userid');
    const localSessionRaw = localStorage.getItem('localSession');
    let parsedLocalSession = null;

    if (localSessionRaw) {
      try {
        parsedLocalSession = JSON.parse(localSessionRaw);
      } catch (_) {
        parsedLocalSession = null;
      }
    }

    if (!isSession && !storedToken) {
      setIsLogged(false);
      setRole(null);
      setUserTag(null);
      setUser(null);
      setLoading(false);
      isCheckingAuthRef.current = false;
      return { success: false };
    }

    const response = await checkAuthRequest();
    
    if (!response.success) {
      const errorMessage = response.message || 'Auth check failed';
      setAuthError(errorMessage);
      
      // On network error, keep session if recently validated
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      if (response.errorCode === 'ECONNABORTED' || response.errorCode === 'ERR_NETWORK') {
        if (timeSinceActivity < TOKEN_REFRESH_INTERVAL && isSession) {
          // Keep session temporarily on network error
          setLoading(false);
          isCheckingAuthRef.current = false;
          return { success: true, warning: 'Network error - using cached session' };
        }
      }
      
      // Clear session on auth error
      clearAllState();
      setLoading(false);
      isCheckingAuthRef.current = false;
      return { success: false, message: errorMessage };
    }

    // Handle 304 Not Modified - session is still valid
    if (response.data.status === 304) {
      const storedUserId = localStorage.getItem('userid');
      const storedRole = localStorage.getItem('role');
      const storedTag = localStorage.getItem('tag');
      
      if (storedUserId || parsedLocalSession?.userid) {
        const hydratedUserId = storedUserId || String(parsedLocalSession.userid);
        const hydratedRole = storedRole || String(parsedLocalSession.role || '');
        const hydratedTag = storedTag || String(parsedLocalSession.tag || '');

        if (!storedUserId && hydratedUserId) {
          localStorage.setItem('userid', hydratedUserId);
          localStorage.setItem('role', hydratedRole);
          localStorage.setItem('tag', hydratedTag);
        }

        setIsLogged(true);
        setUser(hydratedUserId);
        setRole(hydratedRole);
        setUserTag(hydratedTag);
        setLoading(false);
        resetSessionTimeout();
        isCheckingAuthRef.current = false;
        return { success: true };
      }
    }
    
    // Handle authenticated response with data
    const storedUserId = localStorage.getItem('userid');
    const storedRole = localStorage.getItem('role');
    const storedTag = localStorage.getItem('tag');
    
    // Check if backend provides user details
    if (response.data.id !== undefined) {
      // Backend provides full user data - use it
      const backendUserId = String(response.data.id);
      const backendRole = String(response.data.role || '');
      const backendTag = String(response.data.tag || '');
      
      if (storedUserId !== backendUserId || storedRole !== backendRole) {
        localStorage.setItem('userid', backendUserId);
        localStorage.setItem('role', backendRole);
        localStorage.setItem('tag', backendTag);
      }

      localStorage.setItem('localSession', JSON.stringify({
        userid: backendUserId,
        role: backendRole,
        tag: backendTag
      }));
      
      setIsLogged(true);
      setUser(backendUserId);
      setRole(backendRole);
      setUserTag(backendTag);
      setLoading(false);
      resetSessionTimeout();
      isCheckingAuthRef.current = false;
      return { success: true };
    } else if (storedUserId) {
      // Backend only confirms auth, use stored values
      setIsLogged(true);
      setUser(storedUserId);
      setRole(storedRole);
      setUserTag(storedTag);
      setLoading(false);
      resetSessionTimeout();
      isCheckingAuthRef.current = false;
      return { success: true };
    } else {
      // No stored data available
      clearAllState();
      setLoading(false);
      isCheckingAuthRef.current = false;
      return { success: false, message: 'No user data available' };
    }
  }, [checkAuthRequest, clearAllState, resetSessionTimeout]);

  useEffect(() => {
    checkAuthStatusRef.current = checkAuthStatus;
    clearAllStateRef.current = clearAllState;
  }, [checkAuthStatus, clearAllState]);

  // Token refresh interval - use ref to avoid recreating interval on callback changes
  useEffect(() => {
    if (isLogged) {
      refreshIntervalRef.current = setInterval(() => {
        checkAuthStatusRef.current?.(); // Use ref for stable reference
      }, TOKEN_REFRESH_INTERVAL);
    }
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isLogged]); // Only depend on isLogged, not the callback

  useEffect(() => {
    // Guard against double initialization (React StrictMode)
    if (hasInitializedRef.current) {
      return;
    }
    hasInitializedRef.current = true;
    
    checkAuthStatusRef.current?.(true);
    
    // Listen for session changes in other tabs
    const handleStorage = (e) => {
      if (["userid", "role", "tag"].includes(e.key)) {
        checkAuthStatusRef.current?.(); // Don't force on storage events
      }
      // Handle logout in other tabs
      if (e.key === 'logout-event') {
        clearAllStateRef.current?.();
      }
    };
    window.addEventListener("storage", handleStorage);
    
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearSessionTimers();
    };
  }, [clearSessionTimers]);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setAuthError(null);
    
    // Input validation
    if (!username || !password) {
      setLoading(false);
      const error = 'Username and password are required';
      setAuthError(error);
      return { success: false, message: error };
    }
    
    const response = await loginRequest({ username, password });
    
    if (!response.success) {
      const errorMessage = response.message || 'Login failed';
      setAuthError(errorMessage);
      setLoading(false);
      return { success: false, message: errorMessage };
    }

    const { id, tag, role } = response.data;
    
    // Validate response data
    if (!id && id !== 0) {
      const error = 'Invalid response from server - missing id';
      setAuthError(error);
      setLoading(false);
      return { success: false, message: error };
    }
    
    // Convert to strings and save to localStorage
    const userId = String(id);
    const userTag = String(tag || '');
    const userRole = String(role || '');
    
    localStorage.setItem('userid', userId);
    localStorage.setItem('tag', userTag);
    localStorage.setItem('role', userRole);
    localStorage.setItem('localSession', JSON.stringify({
      userid: userId,
      tag: userTag,
      role: userRole
    }));
    
    // Update state
    setUser(userId);
    setUserTag(userTag);
    setRole(userRole);
    setIsLogged(true);
    setLoading(false);
    resetSessionTimeout();
    
    return { success: true };
  }, [loginRequest, resetSessionTimeout]);

  const logout = useCallback(async (reason = 'User logout') => {
    setLoading(true);
    
    // Call logout API
    await logoutRequest();
    
    // Clear everything regardless of API response
    clearAllState();
    
    // Notify other tabs about logout
    localStorage.setItem('logout-event', Date.now().toString());
    localStorage.removeItem('logout-event');
    
    setLoading(false);
    
    return { success: true, reason };
  }, [logoutRequest, clearAllState]);

  // Role-based access control helpers
  const hasRole = useCallback((requiredRole) => {
    if (!isLogged || !role) {
      return false;
    }
    
    // Define role hierarchy
    const roleHierarchy = {
      'superadmin': 4,
      'admin': 3,
      'moderator': 2,
      'user': 1
    };
    
    const userRoleLevel = roleHierarchy[role.toLowerCase()] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole.toLowerCase()] || 0;
    
    const result = userRoleLevel >= requiredRoleLevel;
  
    return result;
  }, [isLogged, role]);

  const hasPermission = useCallback((permission) => {
    if (!isLogged) return false;
    
    // Define permissions by role
    const rolePermissions = {
      'admin': ['read', 'write', 'delete', 'management'],
      'user': ['read', 'write']
    };
    
    const userPermissions = rolePermissions[role?.toLowerCase()] || [];
    return userPermissions.includes(permission);
  }, [isLogged, role]);

  // Extend session (dismiss warning)
  const extendSession = useCallback(() => {
    setSessionWarning(false);
    resetSessionTimeout();
  }, [resetSessionTimeout]);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isLogged,
        role,
        usertag,
        authError,
        sessionWarning,
        login, 
        logout, 
        checkAuthStatus,
        hasRole,
        hasPermission,
        extendSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => { 
  const context = useContext(AuthContext); 
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context; 
};
