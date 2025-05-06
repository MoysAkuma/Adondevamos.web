import React, { useState, useEffect } from "react";
import TripCard from "./TripCard";
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
import PlaceCard from "./PlaceCard";
import { Description } from "@mui/icons-material";

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
      
        //getnewTrips();
      }, []);
      setArrNewTrips([
        {
          Name : "Test trip 1",
          id: 1,
          Description : "Description test"
        },
        {
          Name : "Test trip 2",
          id: 2,
          Description : "Description test"
        },
        {
          Name : "Test trip 3",
          id: 3,
          Description : "Description test"
        }
      ]);
    if (loading) return <div>Loading new trips...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
      <div>
      <Typography variant="h6" component="h6" gutterBottom align="center">
        New Trips!
      </Typography>
      <Box
        sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%'
      }}
      >
        <PlaceCard  />
        <PlaceCard />
        <PlaceCard />
        </Box>
        </div>
    );
}
export default NewTrips;