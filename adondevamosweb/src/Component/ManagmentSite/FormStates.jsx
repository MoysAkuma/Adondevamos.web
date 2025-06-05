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
function FormStates(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [isEdit, setisEdit] = useState(false);
    
    const [loading, setLoading] = useState(true);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [submitSuccess,setSubmitSuccess] = useState(false);
    
    const [submitError, setSubmitError] = useState('');
    
    const [URLsCatalogService, setURLsCatalogService] = useState(
    {
        Countries:`${config.api.baseUrl}${config.api.endpoints.Countries}`,
        States:`${config.api.baseUrl}${config.api.endpoints.States}`,
        Cities:`${config.api.baseUrl}${config.api.endpoints.Cities}`,
        Country:`${config.api.baseUrl}${config.api.endpoints.Country}`,
        State:`${config.api.baseUrl}${config.api.endpoints.State}`,
    }
    );

    const [formStates,setFormStates] = useState({
        name : '',
        originalname : '',
        acronyn : '',
        countryid : 0,
        hide : false
    });

    const [catCountries, setCatCountries] = useState([]);

    //update request
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormStates(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);
        console.log(formStates);
        try {
        // Validate for field Name
        if (!formStates.name.trim()) {
            throw new Error('Name of country is required');
        }
        if (!formStates.countryid) {
            throw new Error('Select a country is required');
        }
        
        axios.post(URLsCatalogService.State, formStates )
        .then(resp => {
            //Stop loading form
            setLoading(false);
            //empty form
            setFormStates({
                name : '',
                originalname : '',
                acronyn : '',
                countryid : 0,
                hide : false
            });
        })
        .catch(error => console.error("Error creating a states"));
        
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error creating state:', error);
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
                  { isEdit ? "Edit states" : "Create states"}
                </Typography>
    
                <TextField
                    id="name"
                    name="name"
                    label="Name"
                    placeholder="Name of State"
                    variant="outlined"
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    value={formStates.name}
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
                    value={formStates.originalname}
                    fullWidth
                    required
                />

              <CountriesSelectList val={formStates.countryid} onChangecall={handleChange} catCountries={catCountries} />
    
                
    
                <FormGroup>
                    <FormControlLabel  
                        control={
                        <Checkbox 
                        onChange={handleChange}
                        id="show"
                        name="enabled" 
                          />} 
                    label="Show it to all?" />
                </FormGroup>
        
                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    variant="contained"
                > { (isEdit) ? "Save Changes" : "Create State" } 
                </Button>
              </Box>
    </>);
}

export default FormStates;