import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NewTrips from "../Component/NewTrips";
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

 function MainTrips(){
    return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box
            component=""
            sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
            }}
        >
            <Typography variant="h5" align="center">
                Main Page of trips
            </Typography>
            <Typography variant="h6" align="left">
                What is a Trip in AdondeVamos?
            </Typography>
            <Typography variant="body1" align="right">
                A trip is a list of places you want to visit with your friend
            </Typography>

            <Typography variant="h6" align="left">
                Last created trips by users
            </Typography>

            <NewTrips/>

        </Box>
    </Container>);
 }
 export default MainTrips;