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
    const [arrNewTrips, setArrNewTrips] = useState([]);
    const setNewTrips = async (e) => {
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
    console.log(arrNewTrips);
  }
    return (
      <div>
      <Typography variant="h6" component="h6" gutterBottom align="center">
        New Trips!
      </Typography>
      <Button onClick={setNewTrips}>click</Button>
      <Box
        sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%'
      }}
      >
        {
            arrNewTrips.length > 0 ? arrNewTrips.map(
                (x)=>(
                    <TripCard tripinfo={x}/>
                  )
            ) : <p>No new trips to show</p>
        }
        </Box>
        </div>
    );
}
export default NewTrips;