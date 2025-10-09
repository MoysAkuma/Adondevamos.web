import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 
    {
        Stack, 
        Button,
        Container,
        Typography,
        Box,ButtonGroup
    } from '@mui/material';
import { Flight, Search } from '@mui/icons-material';
import TripCard from "../Component/View/TripCard";

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
                Trips
            </Typography>
            {
                isUser ? (
                    <>
                        <ButtonGroup variant="text" aria-label="text button group" fullWidth sx={{ mt: 2, mb: 2 }}>
                            <Button variant="text" 
                                startIcon={ <Flight/> }
                                href="/CreateTrip" >
                                    Create a new trip
                            </Button>
                        
                        <Button variant="text" 
                            endIcon={ <Search/> }
                            href="/Search/Trips" >
                                Search for trips
                        </Button>
                        </ButtonGroup>
                    </>
                ) : 
                (   <>
                        <Typography variant="body1" align="right">
                            You need to create an account and login, then you can create a trip and share with your friends.
                        </Typography>
                        <ButtonGroup variant="text" aria-label="text button group" fullWidth sx={{ mt: 2, mb: 2 }}>
                            <Button variant="text" 
                                endIcon={ <Search/> }
                                href="/SearchTrip" >
                                    Search for trips
                            </Button>
                        </ButtonGroup>
                    </>
                )
            }
            <Typography variant="h6" align="left">
                What is a Trip in AdondeVamos?
            </Typography>
            <Typography variant="body1" align="right">
                A trip is a list of places you want to visit with your friends.
            </Typography>

            <TripCard
                tripinfo={{
                    name: "Trip Name Example",
                    description: "Trip Description Example",
                    owner:{ tag: "User_Tag" },
                    statics:{ Votes: { Total:0 } },
                    initialdate: null,
                    finaldate: null,
                    id: 0,
                    itinerary: [
                        { id: 0, name: "Place Name Example", location: "Location 1" }
                    ],
                }}
            />
            

        </Box>
    </Container>);
 }
 export default MainTrips;