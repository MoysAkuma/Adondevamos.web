import { useState } from 'react';
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

import Facilitymanager from "../Component/ManagmentSite/Facilitymanager";
import CountryManager from '../Component/ManagmentSite/CountryManager';
import StatesManager from '../Component/ManagmentSite/StatesManager';
import CitiesManager from '../Component/ManagmentSite/CitiesManager';


 function ManageSite(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            
            <Facilitymanager />

            <CountryManager />

            <StatesManager />

            <CitiesManager />
            
        </Container>)
}

export default ManageSite;