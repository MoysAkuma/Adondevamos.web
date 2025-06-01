import React from "react";
import { useState } from 'react';
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


function FormFacility({id}){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [ModuleName, setModuleName] = useState("Create facility");
    
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess,setSubmitSuccess] = useState(false);

    const [formFacility,setFormFacility] = useState({
        name: '',
        enabled:true,
        hide:false
    });
    if (id != null){
        setModuleName("Edit Facility");
    }
    
    //update request
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormFacility(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);
    };

    return (
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
        <Typography variant="h6" component="h6" gutterBottom align="center">
          {ModuleName}
        </Typography>
        <TextField
            id="name"
            name="name"
            label="Name"
            placeholder="Name of facility"
            variant="outlined"
            onChange={handleChange}
            size={isMobile ? 'small' : 'medium'}
            value={formCreatePlace.name}
            fullWidth
            required
        />
        <Checkbox onChange={handleChange}>Show</Checkbox>
        <Checkbox onChange={handleChange}>Enabled</Checkbox>
      </Box>
    );
}
export default FormFacility;