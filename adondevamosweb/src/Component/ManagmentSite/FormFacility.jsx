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


function FormFacility({id}){
    //Init variables
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [isEdit, setisEdit] = useState("Create facility");
    
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess,setSubmitSuccess] = useState(false);

    const [URLgetFacility,setURLFacility] = useState(`${config.api.baseUrl}${config.api.endpoints.Facility}`);

    const [formFacility,setFormFacility] = useState({
        name: '',
        code:'',
        enabled:true,
        hide:false
    });
    
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
        try {
        // Validate for field Name
        if (!formFacility.name.trim()) {
            throw new Error('Name of facility is required');
        }
        console.log(formFacility);
        axios.post(URLgetFacility, formFacility )
        .then(resp => {
            //Stop loading form
            setLoading(false);
            //empty form
            setFormFacility({
                name: '',
                code:'',
                enabled:true,
                hide:false
            });
            //call to show new facilities
            console.log(resp.data.info);
        })
        .catch(error => console.error("Error creating a facility"));
        
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error creating place:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    

    useEffect(()=> {
            
    },[]);
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
        <Typography variant="body1" component="body1" gutterBottom align="center">
          { isEdit ? "Create facility":"Edit facility"}
        </Typography>
        <TextField
            id="name"
            name="name"
            label="Name"
            placeholder="Name of facility"
            variant="outlined"
            onChange={handleChange}
            size={isMobile ? 'small' : 'medium'}
            value={formFacility.name}
            fullWidth
            required
        />
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
        > { (isEdit) ? "Create Facility" : "Save Changes" } 
        </Button>
      </Box>
    );
}
export default FormFacility;