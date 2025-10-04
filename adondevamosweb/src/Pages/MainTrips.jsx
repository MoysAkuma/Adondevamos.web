import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NewTrips from "../Component/Trips/NewTrips";
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
                Main Page of trips
            </Typography>
            <Typography variant="h6" align="left">
                What is a Trip in AdondeVamos?
            </Typography>
            <Typography variant="body1" align="right">
                A trip is a list of places you want to visit with your friend
            </Typography>
            <TripCard
                tripinfo={{
                    name: "Trip Name",
                    description: "Trip Description",
                    owner:{ tag: "UserTag" },
                    statics:{ Votes: { Total:0 } },
                    initialdate: "2024-01-01",
                    finaldate: "2024-01-10",
                    id: 0,
                    itinerary: [
                        { id: 0, name: "Place 1", location: "Location 1" },
                        { id: 1, name: "Place 2", location: "Location 2" },
                    ],
                }}
            />
            {
                isUser ? (
                    <>
                        <Typography variant="caption" align="left">
                            You can create a trip by clicking the button "Create a new trip" below. 
                        </Typography>
                        <Typography variant="caption" align="right">
                            Or you can search for trips created by other users by clicking the button "Search for trips".
                        </Typography>
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
            
            
            <NewTrips/>

        </Box>
    </Container>);
 }
 export default MainTrips;