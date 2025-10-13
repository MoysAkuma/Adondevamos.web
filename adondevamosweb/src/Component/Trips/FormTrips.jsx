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
        Alert,
        AlertTitle,
        FormControlLabel,
        Checkbox
        
    } from '@mui/material';

const FormTrips = ({
    formTrip, 
    handleChange

}) => {
    return (
    <>
        <TextField
            id="name"
            name="name"
            label="Name"
            placeholder="Name of this trip"
            variant="standard"
            onChange={handleChange}
            size={ 'small' }
            value={formTrip.name}
            fullWidth
            required                      
        />
    
        <TextField
            type="date"
            InputLabelProps={{
                shrink: true,
            }}
            id="initalDate"
            name="initalDate"
            label="Initial Date"
            placeholder="Initial Date of this trip"
            variant="standard"
            onChange={handleChange}
            size={'small'}
            value={formTrip.initialdate}
            fullWidth
            required
        />
                
        <TextField
            type="date"
            InputLabelProps={{
                shrink: true,
            }}
            id="finaldate"
            name="finaldate"
            label="Final Date"
            placeholder="Initial Date of this trip"
            variant="standard"
            onChange={handleChange}
            size={'small'}
            value={formTrip.finaldate}
            fullWidth
            required
        /> 
    </>);
};

export default FormTrips;