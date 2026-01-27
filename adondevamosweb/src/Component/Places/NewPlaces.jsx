import React, { useState, useEffect } from "react";
import axios from 'axios';
import config from "../../Resources/config";
import PlaceCard from "./PlaceCard";

import 
    {
        Stack,
        Paper,
        Divider,
        CircularProgress
    } from '@mui/material';

function NewPlaces() {
    //urls
    const placesURL = `${config.api.baseUrl}${config.api.endpoints.Places}/lasted/3`;
    //loading
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const [NewPlacesList, setNewPlacesList] = useState([]);
    
    //getNewPlaces
    const getNewPlaces = async( item ) =>{
        axios.get( placesURL )
        .then(resp => {
            setNewPlacesList(resp.data.info);
            setIsLoading(false);
        }
        )
        .catch(error => console.error("Error getting last created places"));
    };
    useEffect(() => {
      let mounted = true;
      if (mounted) getNewPlaces();
      return () => {
        mounted = false
      }
    }, []);
    if( isLoading ) return (<CircularProgress />);
    return (
        <>
        <Paper
            elevation={1}
            sx={{ p : 2, borderRadius : 2, backgroundColor : "rgba(255, 255, 255, 0.9)"}}
        >
            <Stack spacing={2} 
            divider={<Divider />}
            sx={{ overflowX: 'auto', padding: 1, marginTop: 1 }}>
                {
                    NewPlacesList.length > 0 ? NewPlacesList.map(
                        (place) => (
                            <PlaceCard key={place.id} 
                            placeinfo={place} />
                        )
                    ) :
                    (<></>)
                }
            </Stack>
      </Paper>
      </>
    );
}

export default NewPlaces;