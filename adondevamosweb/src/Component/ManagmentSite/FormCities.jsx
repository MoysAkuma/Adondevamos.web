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

function FormCities({formData, callback, countries = [], states = []}){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [isEdit, setisEdit] = useState(false);
    
    const [loading, setLoading] = useState(true);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [submitSuccess,setSubmitSuccess] = useState(false);
    
    const [submitError, setSubmitError] = useState('');

    const [filteredStates, setFilteredStates] = useState([]);
    
    
    //URLS
    const URLCity = `${config.api.baseUrl}${config.api.endpoints.Catalogues}`;
    

    const [formCities,setFormCities] = useState({
        name : '',
        originalname : '',
        countryid : 0,
        stateid : 0,
        enabled : true,
        hide : false
    });

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
        handleChange(e);
        setFilteredStates(states.filter(state => state.countryid === parseInt(e.target.value)));
        
        //reset state
        setFormCities(prev => ({
            ...prev,
            stateid: 0
        }));
    };

    const handleSubmit = async (e) =>{
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
        if(isEdit){
            //Edit mode
            await axios.patch(`${URLCity}/city/${formData.id}`, 
                formCities ).then(resp => {
                    if (resp.status === 200){
                        setSubmitSuccess(true);
                    }
                    
                }
            );

        } else {
            axios.post(URLCity + '/city', formCities )
            .then(resp => {
                    if (resp.status === 201){
                        setSubmitSuccess(true);
                    }
            })
            .catch(error => console.error("Error creating a city"));
        }
        
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error creating city:', error);
        } finally {
            //Stop loading form
            setLoading(false);
            
            setIsSubmitting(false);
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
        }
    };

    useEffect(()=> {
        if (formData && formData.id){
            setisEdit(true);
            setFormCities({
                name : formData.name || '',
                originalname : formData.originalname || '',
                countryid : formData.countryid || 0,
                stateid : formData.stateid || 0,
                hide : formData.hide || false
            });
            setFilteredStates(states.filter(state => state.countryid === formData.countryid));
        } else {
            //Create mode
            setisEdit(false);
        }
    },[formData]);

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
                    catCountries={countries} />
                
                {
                    (formCities.countryid != 0 ) &&
                    (<>
                        {
                            (filteredStates.length === 0) &&
                            (<Typography variant="body2" color="error">
                                No states available for the selected country. Please add states first.
                            </Typography>)
                        }
                        <StateSelect 
                        val={formCities.stateid} 
                        onChangecall={handleChange} 
                        countryId={formCities.countryid} 
                        catStates={filteredStates} />
                    </>)
                    
                }

                
        
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