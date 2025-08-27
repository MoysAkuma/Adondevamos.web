import React from 'react';
import {Alert} from '@mui/material'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const hasSession = localStorage.getItem('userid');    
    if (!hasSession) {
      return <Navigate to="/login" replace />;
    }
    return (children);
};

export default ProtectedRoute;
