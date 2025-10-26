import { useState, useEffect } from 'react';
import axios from 'axios';
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        InputAdornment,
        Typography,
        IconButton,
        Stack
    } from '@mui/material';

import { FlightTakeoff, 
    FlightLand, 
    Delete } 
    from '@mui/icons-material';

import config from '../../Resources/config';
import PlaceListFound from '../View/PlaceListFound';

function SearchPlaces({ callback, itinerary }){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(false);

    //var param to search places with a given name
    const [placename, setPlaceName] = useState('');

    //selected place from found list
    const [selectedPlace, setSelectedPlace] = useState(null);

    //Callback object
    const [initialDate, setInitialDate] = useState("");
    const [finalDate, setFinalDate] = useState("");
    //Urls
    const [URLsCatalogService, setURLsCatalogService] = useState(
        {
            Trips : `${config.api.baseUrl}${config.api.endpoints.Trips}`,
            Places : `${config.api.baseUrl}${config.api.endpoints.Places}`
        }
    );

    //place list
    const [findedPlaces, setFindedPlaces] = useState([
        {
            id : 1,
            name : "Place name",
            description : "A place description"
        }
    ]);

    //update request
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlaceName(value);
        if( value.length >= 3 ) {
            searchPlaceList(value);
        }
    };

    //handle change of place 
    const handleChangeplace = (e) => {
        switch(e.target.name){
            case "initialdate": 
                setInitialDate(e.target.value);
            break;

            case "finaldate": 
                setFinalDate(e.target.value);
            break;
        }
    };

    //request to get place list
    const searchPlaceList = async( item ) =>{
        axios.get(URLsCatalogService.Places+'/Search/name='+item)
        .then(resp => {
            setFindedPlaces(resp.data.info);
            if(resp.data.info.length > 0){
                setLoading(true);
            }
        })
        .catch(error => { 
            console.error("Error searching places")}
        );
    };

    const addPlace = async( item ) =>{
        const place = findedPlaces.filter( (x) => ( x.id == item ) )[0];
        setSelectedPlace(place);
    };

    const callresponse = async( final ) =>{
        const resp = {
            id : selectedPlace.id,
            name : selectedPlace.name,
            description : selectedPlace.description,
            initialdate : initialDate,
            finaldate : final
        };
        //restart component
        setFinalDate("");
        setInitialDate("");
        setPlaceName("");
        setLoading(false);
        setSelectedPlace(null);
        //Return response
        callback(resp);
    }

    useEffect(()=> {
        
    },[]);

    return (<>
        <Typography variant="body1"  gutterBottom align="left">
           { 
                !placename ? 
                "Search Places to add to your itinerary" : (!selectedPlace ? "Choose a place " : "")
           } 
        </Typography>
        {
            selectedPlace ? 
            (
                <>
                    <Typography variant="p"  
                        gutterBottom 
                        align="left">
                        Selected Place
                    </Typography>
                    
                    {
                        selectedPlace ? ( 
                        <>
                        <Stack direction="row" spacing={1} alignItems="center" >
                            <Typography variant="body1"  gutterBottom sx={{mb:0}} >
                                {selectedPlace.name}
                            </Typography>
                            <IconButton aria-label="delete" onClick={ () => setSelectedPlace(null) }>
                                <Delete  />
                            </IconButton>
                        </Stack>
                        </>
                        )  : <></>
                    }
                    
                    {

                    }
                    <TextField
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        id="initialdate"
                        name="initialdate"
                        label="Visit Initial Date"
                        placeholder="Initial Visit Date"
                        variant="outlined"
                        onChange={handleChangeplace}
                        size={isMobile ? 'small' : 'medium'}
                        value={initialDate}
                        fullWidth
                        required
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FlightLand />
                                    </InputAdornment>
                                    )
                            }
                        }}
                    />

                    <TextField
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        id="finaldate"
                        name="finaldate"
                        label="Visit Final Date"
                        placeholder="Final Visit Date"
                        variant="outlined"
                        onChange={handleChangeplace}
                        size={isMobile ? 'small' : 'medium'}
                        value={finalDate}
                        fullWidth
                        required
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FlightTakeoff />
                                    </InputAdornment>
                                )
                            }
                        }}
                        onBlurCapture={() => callresponse(finalDate) }
                    />
                </>
            ) : <>
                <TextField
                    id="placename"
                    name="placename"
                    label="Name"
                    placeholder="Name of place"
                    variant="standard"
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    value={placename}
                    fullWidth
                />
                {
                    (loading && placename.length >= 3 ) ? 
                        ( 
                            <PlaceListFound 
                                placeList={findedPlaces} 
                                callback={addPlace} 
                                itinerary={itinerary} 
                            />) 
                        : 
                        ( <></>)
                }
            </>
        }        
    </> );
}

export default SearchPlaces;