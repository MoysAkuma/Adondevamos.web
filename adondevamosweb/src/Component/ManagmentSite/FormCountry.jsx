import React from "react";
import { useState, useEffect } from 'react';
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
import useAuthenticatedApi from '../../hooks/useAuthenticatedApi';

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
    const { post, patch, isAdmin } = useAuthenticatedApi();

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
        if (!isAdmin) {
            setSubmitError('Only administrators can create or modify records.');
            return;
        }
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
            const resp = await patch(`${URLCountry}/${formData.id}`, formCountry);
            if (resp.status === 200){
                setSubmitSuccess(true);
            }
        } else {
            const resp = await post(URLCountry, formCountry);
            if (resp.status === 201){
                setSubmitSuccess(true);
            }
        }

        setLoading(false);
        setFormCountry({
            name: '',
            originalname:'',
            acronym:'',
            enabled:true,
            hide:false
        });
        callback();
        
        
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
                disabled={isSubmitting || !isAdmin}
                variant="contained"
            > { (isEdit) ? "Save Changes" : "Create Country" } 
            </Button>
            {!isAdmin && (
                <Typography variant="body2" color="error">
                    Only administrators can create or modify records.
                </Typography>
            )}
            {submitError && (
                <Typography variant="body2" color="error">
                    {submitError}
                </Typography>
            )}
          </Box>
    </>);
}
export default FormCountry;