import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ConfirmEmail(){
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const confirmEmail = async () => {
          const url ="http://localhost:3000/ConfirmEmail";
          try {
            const resp = await axios.get(url);
            setArrMostVotedPlaces(resp.Info);
            console.log(resp);
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        };
        confirmEmail();
      }, []);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (<p>Confirm Email</p>);
}

export default ConfirmEmail;