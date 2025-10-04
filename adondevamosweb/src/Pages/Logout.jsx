import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 
    {
        Typography  
    } from '@mui/material';
import { useAuth }  from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

function Logout(){
    //navigate
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const {calllogout} = useAuth();

    const callLogout = async () => {
        localStorage.removeItem('userid');
        localStorage.removeItem('tag');
        localStorage.removeItem('role');
        const response = 
            await calllogout();
        if(response.success){
            navigate("/");
        }
    };
    useEffect(() => {
        callLogout();
      }, []);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (<></>);
}

export default Logout;