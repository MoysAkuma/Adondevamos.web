import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import config from "../Resources/config";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  checkAuthStatus: () => false
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [usertag, setUserTag] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  
  axios.defaults.withCredentials = true;

  const URLs = {
    Site: `${config.api.baseUrl}`
  };

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for session changes in other tabs
    const handleStorage = (e) => {
      if (["userid", "role", "tag"].includes(e.key)) {
        checkAuthStatus();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
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
        { withCredentials: true }
      );
      
      if (response.data.info.isAuthenticated) {
        setIsLogged(true);
        setUser(localStorage.getItem('userid'));
        setRole(localStorage.getItem('role'));
        setUserTag(localStorage.getItem('tag'));
        setLoading(false);
        return { success: true };
      } else {
        // Backend says not authenticated, clear local storage
        localStorage.removeItem('userid');
        localStorage.removeItem('tag');
        localStorage.removeItem('role');
        setIsLogged(false);
        setRole(null);
        setUserTag(null);
        setUser(null);
        setLoading(false);
        return { success: false };
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // On error, clear session
      localStorage.removeItem('userid');
      localStorage.removeItem('tag');
      localStorage.removeItem('role');
      setIsLogged(false);
      setRole(null);
      setUserTag(null);
      setUser(null);
      setLoading(false);
      return { success: false, message: error.response?.data?.message || 'Auth check failed' };
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${URLs.Site}/Login`,
        { 
          id: username, 
          password: password 
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Save to localStorage
        localStorage.setItem('userid', response.data.info.id);
        localStorage.setItem('tag', response.data.info.tag);
        localStorage.setItem('role', response.data.info.role);
        
        // Update state
        setUser(response.data.info.id);
        setUserTag(response.data.info.tag);
        setRole(response.data.info.role);
        setIsLogged(true);
        setLoading(false);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${URLs.Site}/Logout`, 
        {}, 
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear everything regardless of API response
      localStorage.removeItem('userid');
      localStorage.removeItem('tag');
      localStorage.removeItem('role');
      setUser(null);
      setUserTag(null);
      setRole(null);
      setIsLogged(false);
      setLoading(false);
    }
    return { success: true };
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isLogged,
        role,
        usertag,
        login, 
        logout, 
        checkAuthStatus 
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
