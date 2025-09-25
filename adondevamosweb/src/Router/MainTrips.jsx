import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NewTrips from "../Component/NewTrips";
import 
    {
        Stack, 
        Button,
        Container,
        Typography,
        Box
    } from '@mui/material';
import { Flight } from '@mui/icons-material';

 const MainTrips = () => {
    const [isUser, setIsUser] = useState(false);
    
    useEffect(()=> {
        setIsUser( (localStorage.getItem('userid') != null) );
    },[]);

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

            <Typography variant="subtitle1" align="right">
                What to create a trip?
            </Typography>
            {
                isUser ? (
                    <>
                        <Typography variant="caption" align="right">
                            You can create a trip by clicking the button "Create a new trip" below.
                        </Typography>
                        <Button variant="text" 
                        endIcon={ <Flight/> }
                        href="/CreateTrip" >
                            Create a new trip
                        </Button>
                    </>
                ) : 
                (
                    <Typography variant="body1" align="right">
                        You need to create an account and login, then you can create a trip and share with your friends.
                    </Typography>
                )
            }
            
            <NewTrips/>

        </Box>
    </Container>);
 }
 export default MainTrips;