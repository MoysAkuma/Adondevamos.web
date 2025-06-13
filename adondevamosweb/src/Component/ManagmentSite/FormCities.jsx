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

function FormCities({id, callback}){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [isEdit, setisEdit] = useState(false);
    
    const [loading, setLoading] = useState(true);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [submitSuccess,setSubmitSuccess] = useState(false);
    
    const [submitError, setSubmitError] = useState('');
    
    const [URLCountry,setURLCountry] = useState(`${config.api.baseUrl}${config.api.endpoints.Country}`);

    const [formCities,setFormCities] = useState({
        name : '',
        originalname : '',
        acronyn : '',
        countryid : 0,
        statesid : 0,
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
        axios.post(URLCountry, formCities )
        .then(resp => {
            //Stop loading form
            setLoading(false);
            //empty form
            setFormCities({
                name: '',
                countryid : null,
                stateid:null,
                enabled:true,
                hide:false
            });
            //callback
            callback();
        })
        .catch(error => console.error("Error creating a cities"));
        
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error creating city:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


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
                > { (isEdit) ? "Save Changes" : "Create Country" } 
                </Button>
              </Box>
    </>);
}

export default FormCities;