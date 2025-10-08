import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import config from "../Resources/config";

const AuthContext = createContext({user: null,
  login: () => {},
  calllogout: () => { },
  checkAuthStatus: () => false});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [usertag, setUserTag] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [role, setRole] = useState(false);
  const [loading, setLoading] = useState(false);

  //URLS
  const [URLs, setURLs] = useState(
      {
          Site:`${config.api.baseUrl}`
      }
  );

  useEffect(() => {
    const isSession = localStorage.getItem('userid');
    if (isSession) {
      checkAuthStatus();
    } else {
      setIsLogged(false);
      setRole(null);
      setUserTag(null);
      setUser(null);
    }
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
    try {
      const response = await axios.get(
        URLs.Site + '/check-auth',
        { withCredentials: true }
      );
      if( response.data.isAuthenticated ){
        setIsLogged(true);
        setRole(localStorage.getItem('role'));
        setUserTag(localStorage.getItem('tag'));
        return { success: true };
      }
      
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'User was logged' };
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await axios.post(
        URLs.Site + '/login',
        { 
            id: username, 
            password : password 
        },
        { withCredentials: true }
      );

      if( response.status == 200 ) {
        setIsLogged(true);
        //Save user id
        setUser(response.data.id);
        localStorage.setItem('userid', response.data.id );
        //Save user tag
        setUserTag(response.data.tag);
        localStorage.setItem('tag', response.data.tag );
        //Save role
        setRole(response.data.role);
        localStorage.setItem('role', response.data.role );
        // Re-check session from backend to sync state
        await checkAuthStatus();
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    console.log("Logout initiated");
    try {
      setUser(null);
      const response = await axios.post(URLs.Site 
        +'/logout', 
        {}, 
        { withCredentials: true });
      localStorage.removeItem('userid');
      localStorage.removeItem('tag');
      localStorage.removeItem('role');
      setIsLogged(false);
      setRole(null);
      setUserTag(null);
      // Re-check session from backend to sync state
      await checkAuthStatus();
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setLoading(false);
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
        checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>{ 
  const context = useContext(AuthContext); 
  if(context === undefined) {
    throw new Error("Shit");
  }
  return context; 
}
