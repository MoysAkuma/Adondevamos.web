import React, { useState, useEffect } from "react";
import PlaceCard from "./View/PlaceCard";
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
    const [arrMostVotedPlaces, setMostVotedPlaces] = useState([{
              Name : "Nihon Trip 2024",
              id : 1,
              description : "First time at japan, itinerary made by Luis hongo and site by MoysAkuma",
              itinerary : [
                {
                  id:1,
                  name:"Naritasan Shinsho-ji",
                  initialDate: "2024-02-04",
                  finalDate: "2024-02-04",
                },
                {
                  id:2,
                  name:"Naritasan Shinsho-ji",
                  initialDate: "2024-02-04",
                  finalDate: "2024-02-04"
                }
              ],
              
            }]);
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