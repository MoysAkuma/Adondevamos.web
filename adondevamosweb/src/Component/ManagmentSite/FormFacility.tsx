import React from "react";
import { useState, useEffect } from 'react';
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
import useAuthenticatedApi from '../../hooks/useAuthenticatedApi';


function FormFacility({id, callback}){
    const [isEdit, setIsEdit] = useState(false);
    
    const [loading, setLoading] = useState(true);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [submitSuccess,setSubmitSuccess] = useState(false);
    
    const [submitError, setSubmitError] = useState('');
    
    // Use authenticated API hook with admin headers
    const { post, patch, isAdmin } = useAuthenticatedApi();
    
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
        { code: 'Luggage', label: 'Luggage Storage' },
        { code: 'Atm', label: 'ATM' },
        { code: 'AirportShuttle', label: 'Airport Shuttle' },
        { code: 'Architecture', label: 'Architecture' },
        { code: 'Web', label: 'Web' },
        { code: 'VideoLabel', label: 'Video Label' },
        { code: 'Translate', label: 'Translate' },
        { code: 'Train', label: 'Train' },
        { code: 'TheaterComedy', label: 'Theater Comedy' },
        { code: 'TempleBuddhist', label: 'Temple Buddhist' },
        { code: 'Surfing', label: 'Surfing' },
        { code: 'Store', label: 'Store' },
        { code: 'Skateboarding', label: 'Skateboarding' },
        { code: 'SignalCellularNodata', label: 'Signal Cellular No Data' },
        { code: 'Attractions', label: 'Attractions' },
        { code: 'Castle', label: 'Castle' },
        { code: 'Church', label: 'Church' },
        { code: 'Coffee', label: 'Coffee' },
        { code: 'Elevator', label: 'Elevator' },
        { code: 'Forest', label: 'Forest' },
        { code: 'IceSkating', label: 'Ice Skating' }

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
                // Editing existing facility with admin authentication
                await patch(`${URLFacilities}/${id}`, formFacility);
                setIsEdit(false);
            } else {
                // Creating new facility with admin authentication
                await post(URLFacilities, formFacility);
            }
            
            // Success - reset form
            setLoading(false);
            setSubmitSuccess(true);
            setFormFacility({
                name: '',
                code: '',
                enabled: true,
                hide: false
            });
            
            // Call callback if provided
            if (callback) {
                callback();
            }
        
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error saving facility:', error);
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