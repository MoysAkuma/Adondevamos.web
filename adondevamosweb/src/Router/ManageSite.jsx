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
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h5" component="h5" gutterBottom align="center">
                ¿A donde vamos?
            </Typography>
            <Typography variant="h6" component="h6" gutterBottom align="center">
                adondevamos.io
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    width: '100%'
                }}
            >
                <Facilitymanager/>
                <AdminManagement/>
            </Box>
        </Container>)
}

export default ManageSite;