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

function NewTrips(){
    const [NewTripsResp, setNewTripsResp] = useState([]);
    const setNewTrips = async (e) => {
      setNewTripsResp(
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
      <Typography variant="h6" component="h6" gutterBottom align="center">
        New Trips!
      </Typography>
      <Button onClick={setNewTrips}>click</Button>
      <Box
        sx={{
        display: 'grid',
        gap: 3,
        width: '100%'
      }}
      >
        {
            NewTripsResp.length > 0 ? NewTripsResp.map(
                (x)=>(
                    <TripCard key={x.id} tripinfo={x}/>
                  )
            ) : <p>No new trips to show</p>
        }
        </Box>
        </div>
    );
}
export default NewTrips;