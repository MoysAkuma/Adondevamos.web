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
import { useTranslation } from 'react-i18next';

const FormTrips = ({
    formTrip, 
    handleChange

}) => {
    const { t } = useTranslation();
    return (
    <>
        <TextField
            id="name"
            name="name"
            label={t('users.name')}
            placeholder={t('trips.tripNamePlaceholder')}
            variant="standard"
            onChange={handleChange}
            size={ 'small' }
            value={formTrip.name}
            fullWidth
            required                      
        />

        <TextField
            id="description"
            name="description"
            label={t('users.description')}
            placeholder={t('trips.goalDescription')}
            variant="standard"
            onChange={handleChange}
            size={ 'small' }
            value={formTrip.description}
            multiline
            minRows={6}
            fullWidth
            required                      
        />
    
        <TextField
            type="date"
            InputLabelProps={{
                shrink: true,
            }}
            id="initialdate"
            name="initialdate"
            label={t('trips.initialDate')}
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
            label={t('trips.finalDate')}
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