import React from "react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import 
    {
        TextField, 
        Button,
        Container,
        Typography,
        Box,
        MenuItem,
        FormGroup,
        FormControlLabel,
        Checkbox,
        Select,
        InputLabel,
        FormControl
    } from '@mui/material';
import config from '../../Resources/config';
import FacilityIcon from '../Commons/FacilityIcon';


function FormFacility({id, callback}){
    const [isEdit, setIsEdit] = useState(false);
    
    const [loading, setLoading] = useState(true);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [submitSuccess,setSubmitSuccess] = useState(false);
    
    const [submitError, setSubmitError] = useState('');
    
    const URLFacilities = `${config.api.baseUrl}${config.api.endpoints.Catalogues}/facility`;

    // Available facility icons
    const facilityIconOptions = [
        { code: 'Wc', label: 'Restroom' },
        { code: 'Subway', label: 'Subway/Transport' },
        { code: 'Wifi', label: 'WiFi' },
        { code: 'Restaurant', label: 'Restaurant' },
        { code: 'Parking', label: 'Parking' },
        { code: 'AC', label: 'Air Conditioning' },
        { code: 'Pool', label: 'Pool' },
        { code: 'Gym', label: 'Gym' },
        { code: 'Pets', label: 'Pets Allowed' },
        { code: 'Smoking', label: 'Smoking Area' },
        { code: 'Bar', label: 'Bar' },
        { code: 'LocalPostOffice', label: 'Post Office' },
        { code: 'Phone', label: 'Phone' },
        { code: 'Luggage', label: 'Luggage Storage' }
    ];

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
            // Validate for field Code
            if (!formFacility.code.trim()) {
                throw new Error('Icon code is required');
            }
            if (isEdit){
                // Editing existing facility
                await axios.patch(`${URLFacilities}/${id}`, formFacility );
                setIsEdit(false);
            }
            axios.post(URLFacilities, formFacility )
            .then(
                resp => {
                    //Stop loading form
                    setLoading(false);
                    //empty form
                    setFormFacility({
                        name: '',
                        code:''
                    });
                    callback();
            }
        )
        .catch(error => console.error("Error creating a facility"));
        
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error creating place:', error);
        } finally {
            setIsSubmitting(false);
        }
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
            <TextField
                id="name"
                name="name"
                label="Name"
                placeholder="Name of facility"
                variant="outlined"
                onChange={handleChange}
                size={ 'small' }
                value={formFacility.name}
                fullWidth
                required
            />

            <FormControl fullWidth size='small'>
                <InputLabel id="icon-select-label">Icon</InputLabel>
                <Select
                    labelId="icon-select-label"
                    id="code"
                    name="code"
                    value={formFacility.code}
                    label="Icon"
                    onChange={handleChange}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FacilityIcon code={selected} />
                            <span>{facilityIconOptions.find(opt => opt.code === selected)?.label || 'Select an icon'}</span>
                        </Box>
                    )}
                >
                    {facilityIconOptions.map((option) => (
                        <MenuItem key={option.code} value={option.code}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FacilityIcon code={option.code} />
                                <span>{option.label}</span>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button 
                type="submit" 
                disabled={isSubmitting}
                variant="contained"
            > { (isEdit) ? "Save Changes" : "Create Facility" } 
            </Button>
        </Box>
    );
}
export default FormFacility;