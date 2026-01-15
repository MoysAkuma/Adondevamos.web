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

function FormCountry({formData = null, callback}){
    //Init variables
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [isEdit, setisEdit] = useState(false);
    
    const [loading, setLoading] = useState(true);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [submitSuccess,setSubmitSuccess] = useState(false);
    
    const [submitError, setSubmitError] = useState('');
    
    const URLCountry = `${config.api.baseUrl}${config.api.endpoints.Catalogues}/country`;

    const [formCountry,setFormCountry] = useState({
        name: '',
        originalname:'',
        acronym:'',
        hide:false
    });

    //update request
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormCountry(prev => ({
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
        if (!formCountry.name.trim()) {
            throw new Error('Name of country is required');
        }
        if (!formCountry.acronym.trim()) {
            throw new Error('Acronym is required');
        }
        if(isEdit){
            axios.patch(URLCountry + '/' + 
                formData.id, formCountry )
            .then(resp => {
                if (resp.status === 200){
                    setSubmitSuccess(true);
                }

                //Stop loading form
                setLoading(false);
                //empty form
                setFormCountry({
                    name: '',
                    originalname:'',
                    acronym:'',
                    enabled:true,
                    hide:false
                });
                callback();
            })
            .catch(error => console.error("Error creating a country"));
        } else {
            axios.post(URLCountry, formCountry )
            .then(resp => {
                //Stop loading form
                setLoading(false);
                //empty form
                setFormCountry({
                    name: '',
                    originalname:'',
                    acronym:'',
                    enabled:true,
                    hide:false
                });
                //call to show new facilities
                callback();
            })
            .catch(error => console.error("Error creating a country"));
        }
        
        
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error creating place:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    

     useEffect(() => {
        if (formData) {
            setisEdit(true);
            setFormCountry({
                name: formData.name || '',
                originalname: formData.originalname || '',
                acronym: formData.acronym || '',
                hide: formData.hide || false
            });
            setLoading(false);
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
                placeholder="Name of Country"
                variant="outlined"
                onChange={handleChange}
                size={isMobile ? 'small' : 'medium'}
                value={formCountry.name}
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
                value={formCountry.originalname}
                fullWidth
            />

            <TextField 
                id="acronym"
                name="acronym"
                label="Acronym"
                placeholder="Acronym"
                variant="outlined"
                onChange={handleChange}
                size={isMobile ? 'small' : 'medium'}
                value={formCountry.acronym}
                fullWidth
            />

            <FormGroup>
                <FormControlLabel  
                    control={
                    <Checkbox 
                    onChange={handleChange}
                    id="hide"
                    name="hide"
                    checked={formCountry.hide}
                    />} 
                label="Hide" />
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
export default FormCountry;