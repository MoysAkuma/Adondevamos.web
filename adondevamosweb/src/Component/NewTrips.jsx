import React, { useState, useEffect } from "react";
import TripCard from "./View/TripCard";
import axios from 'axios';
import config from "../Resources/config";
import 
    {
        Typography,
        Box
    } from '@mui/material';

function NewTrips(){
    //URLS
    const [URLsCatalogService, setURLsCatalogService] = useState(
        {
            Trips : `${config.api.baseUrl}${config.api.endpoints.Trips}`
        }
    );

    const [NewTripsList, setNewTripsList] = useState([]);
    
    //getNewTrips
    const getNewTrips = async( item ) =>{
        axios.get( URLsCatalogService.Trips + '/View/News' )
        .then(resp => {
            console.log(resp.data.info);
            setNewTripsList(resp.data.info);
        })
        .catch(error => console.error("Error getting last created trips"));
    };
    useEffect(() => {
      getNewTrips();
    });

    return (
      <>
      <Typography variant="h6" component="h6" gutterBottom align="left">
        New Trips!
      </Typography>
      <Typography variant="span" component="span" gutterBottom align="right">
        Trips created by users like you
      </Typography>
      <Box
        sx={{
        display: 'grid',
        gap: 3,
        width: '100%'
      }}
      >
        {
            NewTripsList.length > 0 ? NewTripsList.map(
                (x)=>(
                    <TripCard 
                      key={x.id} 
                      tripinfo={x}
                    />
                  )
            ) : 
            <Typography variant="span" 
              component="span" 
              gutterBottom align="left">
              No trips added yet. Please create and user and help me!
            </Typography>
        }
        </Box>
        </>
    );
}
export default NewTrips;