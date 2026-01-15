import React from "react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Typography,
        Box,
        FormGroup,
        FormControlLabel,
        Checkbox 
    } from '@mui/material';

import config from '../../Resources/config';
import CountriesSelectList from "../Catalogues/CountriesSelectList";

function FormStates({ formData, callback, countries}){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [isEdit, setisEdit] = useState(false);
    
    const [loading, setLoading] = useState(true);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [submitSuccess,setSubmitSuccess] = useState(false);
    
    const [submitError, setSubmitError] = useState('');
    
    const URLsCatalogService = 
    {
        Catalogues : `${config.api.baseUrl}${config.api.endpoints.Catalogues}`,
        State : `${config.api.baseUrl}${config.api.endpoints.Catalogues}/state`
    }
    

    const [formStates,setFormStates] = useState({
        name : '',
        originalname : '',
        countryid : 0,
        hide : false
    });

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
        try {
            // Validate for field Name
            if (!formStates.name.trim()) {
                throw new Error('Name of country is required');
            }
            if (!formStates.countryid) {
                throw new Error('Select a country is required');
            }
            if(isEdit){
                //Edit mode
                await axios.patch(`${URLsCatalogService.State}/${formData.id}`, 
                    formStates )
            } else {
                await axios.post(URLsCatalogService.State, formStates )
            }
            setLoading(false);
            //empty form
            setFormStates({
                    name : '',
                    originalname : '',
                    countryid : 0,
                    hide : false
                });

                //execute callback
                callback();
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error creating state:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

   
    useEffect(()=> {
        if (formData && formData.id){
            //Edit mode
            setisEdit(true);
            setFormStates({
                name : formData.name || '',
                originalname : formData.originalname || '',
                countryid : formData.countryid || 0,
                hide : formData.hide || false
            });
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

                <CountriesSelectList 
                    val={formStates.countryid} 
                    onChangecall={handleChange} 
                    catCountries={countries} />

                <FormGroup>
                    <FormControlLabel  
                        control={
                        <Checkbox 
                        onChange={handleChange}
                        checked={formStates.hide }
                        id="hide"
                        name="hide" 
                          />} 
                    label="Hide" />
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