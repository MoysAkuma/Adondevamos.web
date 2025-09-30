import React from "react";
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
        Box,
        MenuItem,
        FormGroup,
        FormControlLabel,
        Checkbox 
    } from '@mui/material';

import config from '../../Resources/config';
import CountriesSelectList from "../Catalogues/CountriesSelectList";
import StateSelect from "../Catalogues/StateSelect";
import CitiesSelect from "../Catalogues/CitiesSelect";

function FormCities({id, callback}){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [isEdit, setisEdit] = useState(false);
    
    const [loading, setLoading] = useState(true);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [submitSuccess,setSubmitSuccess] = useState(false);
    
    const [submitError, setSubmitError] = useState('');
    
    //URLS
    const [URLsCatalogService, setURLsCatalogService] = useState(
        {
            Countries:`${config.api.baseUrl}${config.api.endpoints.Countries}`,
            States:`${config.api.baseUrl}${config.api.endpoints.States}`,
            Cities:`${config.api.baseUrl}${config.api.endpoints.Cities}`,
            Country:`${config.api.baseUrl}${config.api.endpoints.Country}`,
            State:`${config.api.baseUrl}${config.api.endpoints.State}`
        }
    );

    const [formCities,setFormCities] = useState({
        name : '',
        originalname : '',
        acronyn : '',
        countryid : null,
        stateid : null,
        enabled : true,
        hide : false
    });

    const [catCountries, setCatCountries] = useState([]);
    const [catStates, setCatStates] = useState([]);

    //update request
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormCities(prev => ({
            ...prev,
            [name]: value
        }));
    };

    //handle selectcountry
    const handleSelectCountry = (e) => {
        if(e){
            handleChange(e);
            getStatesByCountry({id:e.target.value});
        }
    };

    const handleSubmit = async (e) =>{debugger
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);
        try {

        // Validate for field Name
        if (!formCities.name.trim()) {
            throw new Error('Name of city is required');
        }
        
        // Validate for field Country
        if (!formCities.countryid ) {
            throw new Error('Country is required');
        }

        // Validate for field State
        if (!formCities.stateid ) {
            throw new Error('State is required');
        }
        axios.post(URLsCatalogService.Cities, formCities )
        .then(resp => {
            //Stop loading form
            setLoading(false);
            //empty form
            setFormCities({
                name: '',
                originalname:'',
                countryid : null,
                stateid:null,
                enabled:true,
                hide:false
            });
            //callback
            callback();
        })
        .catch(error => console.error("Error creating a city"));
        
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error creating city:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    //getCountries
    const getCountries = async( ) =>{
        axios.get(URLsCatalogService.Countries)
        .then(resp => {
            setCatCountries(resp.data.info);
            setLoading(false);
        })
        .catch(error => console.error("Error getting catalogue of countries"));
    };

    //getStatesByCountry
    const getStatesByCountry = async( item ) =>{
        axios.get(URLsCatalogService.States + '/ByCountryID/' + item.id)
        .then(resp => {
            setCatStates(resp.data.info);
            setLoading(false);
        })
        .catch(error => console.error("Error getting catalogue of states"));
    };

    useEffect(()=> {
        getCountries();
    },[]);

    return (<>
    <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%'
              }}
              >
                <Typography variant="body1" component="body1" gutterBottom align="center">
                  { isEdit ? "Edit cities" : "Create cities"}
                </Typography>
    
                <TextField
                    id="name"
                    name="name"
                    label="Name"
                    placeholder="Name of Cities"
                    variant="outlined"
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    value={formCities.name}
                    fullWidth
                    required
                />
    
                <TextField
                    id="originalname"
                    name="originalname"
                    label="Original Name"
                    placeholder="Original Name"
                    variant="outlined"
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    value={formCities.originalname}
                    fullWidth
                    required
                />

                <CountriesSelectList 
                    val={formCities.countryid} 
                    onChangecall={handleSelectCountry} 
                    catCountries={catCountries} />

                <StateSelect 
                    val={formCities.stateid} 
                    onChangecall={handleChange} 
                    catStates={catStates} />
        
                <FormGroup>
                    <FormControlLabel  
                        control={
                        <Checkbox 
                        onChange={handleChange}
                        id="hide"
                        name="hide" 
                          />} 
                    label="Show it to all?" />
                </FormGroup>
        
                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    variant="contained"
                > { (isEdit) ? "Save Changes" : "Create City" } 
                </Button>
              </Box>
    </>);
}

export default FormCities;