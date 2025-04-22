import React, { useState, useEffect } from "react";
import PlaceCard from "./PlaceCard";
import axios from 'axios';

function MostVotedPlaces(){
    const [arrMostVotedPlaces, setMostVotedPlaces] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const getMostVotedPlaces = async () => {
          const url ="http://localhost:3000/MostVotedPlaces";
          try {
            const resp = await axios.get(url);
            setMostVotedPlaces(resp.Info);
            console.log(resp);
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        };
        getMostVotedPlaces();
      }, []);
    if (loading) return <div>Loading most voted places...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <>
            <p>Most voted places by users</p>
            
        </>
    );
}
export default MostVotedPlaces;