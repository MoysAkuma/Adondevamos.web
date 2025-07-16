import { useState, useEffect } from 'react';
import axios from 'axios';
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Container,
        Typography,
        Box
    } from '@mui/material';

import config from '../../Resources/config';
import PlaceList from '../View/PlaceList';

function TripsItineraty({ countryid, stateid, cityid }){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    //var param to search places with a given name
    const [placename, setPlaceName] = useState('');
    
    //Urls
    const [URLsCatalogService, setURLsCatalogService] = useState(
        {
            Trips : `${config.api.baseUrl}${config.api.endpoints.Trips}`
        }
    );

    //place list
    const [findedPlaces, setFindedPlaces] = useState([
        {
            id : 1,
            name : "Place name",
            description : "A place description",
            facilities : {
                All : "Wc, Wi-Fi"
            }
        }
    ]);

    //update request
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value.lenght > 3){
            console.log(value);
            setPlaceName(value);
            searchPlaceList(value);
        } else {
            setPlaceName('');
        }
        
    };

    //request to get place list
    const searchPlaceList = async( item ) =>{
        axios.get(URLsCatalogService.Trips+'/Search/name='+item)
        .then(resp => {
            setFindedPlaces(resp.data.info);
        })
        .catch(error => { 
            
            console.error("Error verification of tag")}
        );
    };
    return (<>
        <TextField
            id="placename"
            name="placename"
            label="Name"
            placeholder="Name of place"
            variant="outlined"
            onChange={handleChange}
            size={isMobile ? 'small' : 'medium'}
            value={placename}
            fullWidth
        />

    <PlaceList placeList={findedPlaces} />
        

    </> );
}

export default TripsItineraty;