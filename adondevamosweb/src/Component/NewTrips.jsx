import React, { useState, useEffect } from "react";
import TripCard from "./TripCard";
import axios from 'axios';

function NewTrips(){
    const [arrNewTrips, setArrNewTrips] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const getnewTrips = async () => {
          const url ="http://localhost:3000/NewTrips";
          try {
            const resp = await axios.get(url);
            setArrNewTrips(resp.Info);
            console.log(resp);
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        };
        getnewTrips();
      }, []);
    if (loading) return <div>Loading new trips...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <>
            <p>Most recent created trips!</p>
            
        </>
    );
}
export default NewTrips;