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
    const [NewTripsResp, setNewTripsResp] = useState([ 
      {
          name : "Nihon Trip 2024",
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
              name:"Hachiko Statue",
              initialDate: "2024-02-05",
              finalDate: "2024-02-05"
            },
            {
              id:3,
              name:"Sensō-ji",
              initialDate: "2024-02-06",
              finalDate: "2024-02-06"
            }
          ]
      } 
    ]);
    
    useEffect(() => {

    });

    return (
      <>
      <Typography variant="h6" component="h6" gutterBottom align="left">
        New Trips!
      </Typography>
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
            ) : 
            <Typography variant="span" component="span" gutterBottom align="right">
              No trips added yet. Please create and user and help me!
            </Typography>
            
        }
        </Box>
        </>
    );
}
export default NewTrips;