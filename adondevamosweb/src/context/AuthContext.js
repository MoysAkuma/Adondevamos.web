import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import axios from 'axios';
import config from "../Resources/config";

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
  
  axios.defaults.withCredentials = true;

  const URLs = {
    Site: `${config.api.baseUrl}`
  };

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

  // Token refresh interval
  useEffect(() => {
    if (isLogged) {
      refreshIntervalRef.current = setInterval(() => {
        checkAuthStatus();
      }, TOKEN_REFRESH_INTERVAL);
    }
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isLogged]);

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for session changes in other tabs
    const handleStorage = (e) => {
      if (["userid", "role", "tag"].includes(e.key)) {
        checkAuthStatus();
      }
      // Handle logout in other tabs
      if (e.key === 'logout-event') {
        clearAllState();
      }
    };
    window.addEventListener("storage", handleStorage);
    
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearSessionTimers();
    };
  }, []);

  // Clear all authentication state
  const clearAllState = useCallback(() => {
    localStorage.removeItem('userid');
    localStorage.removeItem('tag');
    localStorage.removeItem('role');
    setUser(null);
    setUserTag(null);
    setRole(null);
    setIsLogged(false);
    setAuthError(null);
    clearSessionTimers();
  }, [clearSessionTimers]);

  const checkAuthStatus = async () => {
    setLoading(true);
    setAuthError(null);
    const isSession = localStorage.getItem('userid');

    if (!isSession) {
      setIsLogged(false);
      setRole(null);
      setUserTag(null);
      setUser(null);
      setLoading(false);
      return { success: false };
    }

    try {
      const response = await axios.get(
        `${URLs.Site}/check-auth`,
        { 
          withCredentials: true,
          timeout: 10000 // 10 second timeout
        }
      );
      
      // Handle 304 Not Modified - session is still valid
      if (response.status === 304) {
        // Use stored values since 304 means nothing changed
        const storedUserId = localStorage.getItem('userid');
        const storedRole = localStorage.getItem('role');
        const storedTag = localStorage.getItem('tag');
        
        if (storedUserId) {
          setIsLogged(true);
          setUser(storedUserId);
          setRole(storedRole);
          setUserTag(storedTag);
          setLoading(false);
          resetSessionTimeout();
          return { success: true };
        }
      }
      
      // Handle 200 OK with data
      if (response.data && response.data.info && response.data.info.isAuthenticated) {
        // Get stored values
        const storedUserId = localStorage.getItem('userid');
        const storedRole = localStorage.getItem('role');
        const storedTag = localStorage.getItem('tag');
        
        // Check if backend provides user details
        if (response.data.info.id !== undefined) {
          // Backend provides full user data - use it
          const backendUserId = String(response.data.info.id);
          const backendRole = String(response.data.info.role || '');
          const backendTag = String(response.data.info.tag || '');
          
          if (storedUserId !== backendUserId || storedRole !== backendRole) {
            localStorage.setItem('userid', backendUserId);
            localStorage.setItem('role', backendRole);
            localStorage.setItem('tag', backendTag);
          }
          
          setIsLogged(true);
          setUser(backendUserId);
          setRole(backendRole);
          setUserTag(backendTag);
          setLoading(false);
          resetSessionTimeout();
          return { success: true };
        } else {
          // Backend only confirms auth, use stored values
          if (storedUserId) {
            setIsLogged(true);
            setUser(storedUserId);
            setRole(storedRole);
            setUserTag(storedTag);
            setLoading(false);
            resetSessionTimeout();
            
            return { success: true };
          } else {
            // No stored data available
            
            clearAllState();
            setLoading(false);
            return { success: false, message: 'No user data available' };
          }
        }
      } else {
        // Backend says not authenticated, clear local storage
        
        clearAllState();
        setLoading(false);
        return { success: false };
      }
    } catch (error) {
      
      const errorMessage = error.response?.data?.message || error.message || 'Auth check failed';
      setAuthError(errorMessage);
      
      // On network error, keep session if recently validated
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        if (timeSinceActivity < TOKEN_REFRESH_INTERVAL && isSession) {
          // Keep session temporarily on network error
          setLoading(false);
          return { success: true, warning: 'Network error - using cached session' };
        }
      }
      
      // Clear session on auth error
      clearAllState();
      setLoading(false);
      return { success: false, message: errorMessage };
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    setAuthError(null);
    
    // Input validation
    if (!username || !password) {
      setLoading(false);
      const error = 'Username and password are required';
      setAuthError(error);
      return { success: false, message: error };
    }
    
    try {
      const response = await axios.post(
        `${URLs.Site}/Login`,
        { 
          id: username.trim(), 
          password: password 
        },
        { 
          withCredentials: true,
          timeout: 10000
        }
      );

      if (response.status === 200 && response.data.info) {
        const { id, tag, role } = response.data.info;
        
        // Validate response data
        if (!id && id !== 0) {
          throw new Error('Invalid response from server');
        }
        
        // Convert to strings and save to localStorage
        const userId = String(id);
        const userTag = String(tag || '');
        const userRole = String(role || '');
        
        localStorage.setItem('userid', userId);
        localStorage.setItem('tag', userTag);
        localStorage.setItem('role', userRole);
        
        // Update state
        setUser(userId);
        setUserTag(userTag);
        setRole(userRole);
        setIsLogged(true);
        setLoading(false);
        resetSessionTimeout();
        
        return { success: true };
      }
      
      setLoading(false);
      return { success: false, message: 'Login failed' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setAuthError(errorMessage);
      setLoading(false);
      return { success: false, message: errorMessage };
    }
  };

  const logout = async (reason = 'User logout') => {
    setLoading(true);
    try {
      await axios.post(
        `${URLs.Site}/Logout`, 
        {}, 
        { 
          withCredentials: true,
          timeout: 5000
        }
      );
    } catch (error) {
      // Continue with local logout even if API fails
    } finally {
      // Clear everything regardless of API response
      clearAllState();
      
      // Notify other tabs about logout
      localStorage.setItem('logout-event', Date.now().toString());
      localStorage.removeItem('logout-event');
      
      setLoading(false);
    }
    return { success: true, reason };
  };

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
      'superadmin': ['read', 'write', 'delete', 'manage_users', 'manage_site'],
      'admin': ['read', 'write', 'delete', 'manage_users'],
      'moderator': ['read', 'write', 'delete'],
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
