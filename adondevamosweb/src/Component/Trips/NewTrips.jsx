import React, { useState, useEffect } from "react";
import TripCard from "./TripCard";
import axios from 'axios';
import config from "../../Resources/config";
import { Link as RouterLink } from "react-router-dom"
import 
    {
        Typography,
        Box,
        Stack,
        Divider,
        Paper,
        CircularProgress,
        Grid
    } from '@mui/material';

function NewTrips(){
    //URLS
    const [URLsCatalogService, setURLsCatalogService] = useState(
        {
            Trips : `${config.api.baseUrl}${config.api.endpoints.Trips}`
        }
    );

    //loading
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const [NewTripsList, setNewTripsList] = useState([]);
    
    //getNewTrips
    const getNewTrips = async( item ) =>{
        axios.get( URLsCatalogService.Trips + '/lasted/3' )
        .then(resp => {
            setNewTripsList(resp.data.info);
        })
        .catch(error => console.error("Error getting last created trips"));
    };
    useEffect(() => {
      let mounted = true;
      if (mounted) getNewTrips();
      return () => {
        mounted = false
      }
    }, []);
    if( NewTripsList.length === 0 ) return (<CircularProgress />);
    return (<>
      <Paper
        elevation={1}
        sx={{ p : 2, borderRadius : 2, backgroundColor : "rgba(255, 255, 255, 0.9)"}}
      >
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
      </Paper>
      
    </>
    );
}
export default NewTrips;