import React, { useState, useEffect } from "react";
import TripCard from "./TripCard";
import axios from 'axios';
import config from "../../Resources/config";
import 
    {
        Typography,
        Box,
        Stack,
        Divider
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
            setNewTripsList(resp.data.info);
        })
        .catch(error => console.error("Error getting last created trips"));
    };
    useEffect(() => {
      getNewTrips();
    }, []);

    return (
      <>
      <Typography variant="h6" component="h6" gutterBottom align="left">
        New Trips!
      </Typography>
      <Typography variant="span" component="span" gutterBottom align="right">
        Trips created by users like you
      </Typography>
      <Stack spacing={2} 
      divider={<Divider />}
      sx={{ overflowX: 'auto', padding: 1, marginTop: 1 }}>
        {
            NewTripsList.length > 0 ? NewTripsList.map( (x) => 
              (<TripCard tripinfo={x} key={x.id || x.name} />)) :
              (<Typography variant="span" 
                component="span" 
                gutterBottom align="left">
                No trips added yet. Please create and user and help me!
              </Typography>)
        }
        </Stack>
        </>
    );
}
export default NewTrips;