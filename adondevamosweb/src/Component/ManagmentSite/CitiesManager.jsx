import React, {useState, useEffect} from "react";
import axios from 'axios';
import FormCities from "./FormCities";

import 
    { 
        Button,
        useMediaQuery,
        useTheme,
        Typography,
        Box,
        IconButton,
        List,
        ListItem,
        ListItemText,
        ButtonGroup
} from '@mui/material';

import { Delete, Visibility, VisibilityOff } from '@mui/icons-material';

import config from '../../Resources/config';

function CitiesManager({id, callback}){
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess,setSubmitSuccess] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [countryid, setCountryID] = useState(null);
    const [stateid, setStateID] = useState(null);
    const [isEdit, setisEdit] = useState(false);
    //Catalogues
    const [catStates, setCatStates] = useState([]);
    const [catCountries, setCatCountries] = useState([]);
    const [catCities, setCatCities] = useState([]);

    //URLS
    const [URLsCatalogService, setURLsCatalogService] = useState(
        {
            Countries:`${config.api.baseUrl}${config.api.endpoints.Countries}`,
            States:`${config.api.baseUrl}${config.api.endpoints.States}`,
            Cities:`${config.api.baseUrl}${config.api.endpoints.Cities}`,
            Country:`${config.api.baseUrl}${config.api.endpoints.Country}`,
            State:`${config.api.baseUrl}${config.api.endpoints.State}`,
            City:`${config.api.baseUrl}${config.api.endpoints.City}`
        }
    );
    //deletestate
    const deleteState = async( id ) =>{};

    //getStates
    const getStates = async( id ) =>{
        axios.get(URLsCatalogService.States + '/')
        .then(resp => {
            setCatStates(resp.data.info);
            setLoading(false);
        })
        .catch(error => console.error("Error getting catalogue of states"));
    };

    //getCities
    const getCities = async( ) =>{
        axios.get(URLsCatalogService.Cities)
        .then(resp => {
            setCatCities(resp.data.info);
            setLoading(false);
        })
        .catch(error => console.error("Error getting catalogue of countries"));
    };

    const toggleFormVisibility = () => {
        setShowForm( !showForm );
    };

    const formSuccess = () => {
        getCities();
        setShowForm(false);
    };

    useEffect(()=> {
        getCities();
    },[]);

    return (<Box
        sx={{
                display: 'grid',
                gap: 2,
                width: '100%'
            }}
        >
        <Typography variant="h6" component="h6" gutterBottom align="center">
            Cities 
        </Typography>
        <ButtonGroup variant="outlined" aria-label="Basic button group">
            <Button onClick={toggleFormVisibility} > { showForm ? 'Hide':'Add' }</Button>
        </ButtonGroup>
        
        { showForm && (<FormCities id={stateid} callback={formSuccess} />)}
        
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {
                !loading && catCities.length > 0 ? catCities.map(
                    (x)=>(
                        <ListItem key={x.id}>
                            <ListItemText 
                                primary={x.name} 
                            />
                            <IconButton edge="end">
                                { x.hide ? <Visibility  /> : <VisibilityOff/>}
                            </IconButton>
                            
                        </ListItem>
                )): <ListItem> 
                    <ListItemText primary="No states added yet" ></ListItemText>
                </ListItem>
            }
        </List>
    </Box>
    );
}
export default CitiesManager;