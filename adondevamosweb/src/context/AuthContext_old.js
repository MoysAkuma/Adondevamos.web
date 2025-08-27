import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import config from "../Resources/config";
const AuthContext = createContext({user: null,
  login: () => {},
  calllogout: () => { },
  checkAuthStatus: () => false,});

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
    const isSession = localStorage.getItem('userid');
    if(isSession){
      checkAuthStatus();
    }
  }, []);

  const checkAuthStatus = () => {
    return user !== null;
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        URLs.Site + '/login',
        { 
            id: username, 
            password : password 
        },
        { withCredentials: true }
      );
      localStorage.setItem('userid', response.data.id );
      localStorage.setItem('tag', response.data.tag );
      localStorage.setItem('role', response.data.role );
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    console.log("entro");
    try {
      setUser(null);
      localStorage.removeItem('userid');
      localStorage.removeItem('tag');
      localStorage.removeItem('role');
      const response = await axios.post(URLs.Site 
        +'/logout', 
        {}, 
        { withCredentials: true });
      console.log(response);
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        calllogout:logout, 
        checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>{ 
  const context = useContext(AuthContext); 
  return context; 
}
