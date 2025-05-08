import React, { useState, useEffect } from "react";
import PlaceCard from "./PlaceCard";
import axios from 'axios';
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Container,
        Typography,
        Box,
        MenuItem,
        FormGroup,
        FormControlLabel,
        Checkbox
        
    } from '@mui/material';

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

      const setMostVotedPlacescat = async (e) => {
        setMostVotedPlaces(
          [
            {
              Name : "Test trip 1",
              id: 1,
              Description : "Description test",
              Itinerary:[
                {
                  id:1,
                  Name:"Place Name 1"
                }
              ],
              
            }
          ]
        );
      }
    return (
      <div>
        <Typography variant="h5" component="h5" gutterBottom align="center">
          Most voted places by users
        </Typography>
        <Button onClick={setMostVotedPlacescat}>click</Button>
            
        </div>
    );
}
export default MostVotedPlaces;