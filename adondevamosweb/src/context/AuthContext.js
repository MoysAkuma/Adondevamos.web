import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import config from "../Resources/config";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
    //URLS
    const [URLs, setURLs] = useState(
        {
            Site:`${config.api.baseUrl}`
        }
    );

  useEffect(() => {
    checkAuthStatus();
  }, []);

const checkAuthStatus = async () => {
    try {
      const response = await axios.get(URLs.Site+ '/check-auth', {
        withCredentials: true
      });
      console.log(response);
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        URLs.Site+ '/login',
        { 
            id: username, 
            password : password 
        },
        { withCredentials: true }
      );
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await axios.post(URLs.Site+'/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
