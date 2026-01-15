import React, {useState, useEffect} from "react";
import axios from 'axios';
import FormCities from "./FormCities";

import 
    { 
        Button,
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

function CitiesManager({id, 
    callback,
    cities = [],
    states = [],
    countries = []
}){
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess,setSubmitSuccess] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [countryid, setCountryID] = useState(null);
    const [stateid, setStateID] = useState(null);
    const [isEdit, setisEdit] = useState(false);

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

    const toggleFormVisibility = () => {
        setShowForm( !showForm );
    };

    const formSuccess = () => {
        
        setShowForm(false);
    };

    useEffect(()=> {
        setLoading(false);
    },[]);

    return (<Box
        sx={{
                display: 'grid',
                gap: 2,
                width: '100%'
            }}
        >
        <ButtonGroup variant="outlined" aria-label="Basic button group">
            <Button onClick={toggleFormVisibility} > { showForm ? 'Hide':'Add' }</Button>
        </ButtonGroup>
        
        { showForm && (<FormCities id={stateid} callback={formSuccess} />)}
        
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {
                !loading && cities.length > 0 ? cities.map(
                    (x)=>(
                        <ListItem key={x.id}>
                            <ListItemText 
                                primary={x.name} 
                                secondary={states?.filter(s => s.id === x.stateid)[0]?.name || ''
                                }
                            />
                            <IconButton edge="end">
                                { x.hide ? <Visibility  /> : <VisibilityOff/>}
                            </IconButton>
                            
                        </ListItem>
                )): <ListItem> 
                    <ListItemText primary="No cities added yet" ></ListItemText>
                </ListItem>
            }
        </List>
    </Box>
    );
}
export default CitiesManager;