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

import Facilitymanager from "../Component/Facilitymanager";
import AdminManagement from '../Component/AdminManagement';

 function ManageSite(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            
        <Facilitymanager />

        <AdminManagement />

            
        </Container>)
}

export default ManageSite;