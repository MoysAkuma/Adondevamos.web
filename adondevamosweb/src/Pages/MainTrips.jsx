import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 
{
    Stack, 
    Button,
    Tooltip,
    Typography,
    Box,ButtonGroup
} from '@mui/material';
import { Flight, Search, Person } from '@mui/icons-material';
import TripCard from "../Component/Trips/TripCard";
import NewTrips from "../Component/Trips/NewTrips";
import CenteredTemplate from "../Component/Commons/CenteredTemplate";

 const MainTrips = () => {
    const [isUser, setIsUser] = useState(false);
    
    useEffect(()=> {
        setIsUser( (localStorage.getItem('userid') != null) );
    },[]);

    return (
        <CenteredTemplate>
        <>
            <Typography variant="h4" align="center" gutterBottom>
                Trips
            </Typography>
            <Box
                component=""
                sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%'
                }}
            >
            {
                isUser ? (
                    <>
                        <ButtonGroup 
                        variant="contained" 
                        color="primary" 
                        fullWidth sx={{ mt: 2, mb: 4 }}>
                            <Tooltip title="This feature is not working now">
                                <Button 
                                    variant="contained"
                                    disabled 
                                    startIcon={ <Flight/> }
                                    >
                                        Create a new trip
                                </Button>
                            </Tooltip>
                        
                            <Button variant="outlined" 
                                endIcon={ <Search/> }
                                href="/Search/Trips" >
                                    Search for trips
                            </Button>
                        </ButtonGroup>
                    </>
                ) : 
                (   <>
                        <ButtonGroup 
                            variant="contained" 
                            color="primary" 
                            fullWidth sx={{ mt: 2, mb: 4 }}>
                            <Tooltip title="This feature is not working now">
                                <Button 
                                    variant="contained"
                                    startIcon={ <Person/> }
                                    disabled
                                    href="/login" >
                                        Login or Create account
                                </Button>
                            </Tooltip>
                            <Button variant="outlined" 
                                endIcon={ <Search/> }
                                href="/Search/Trips"
                            >
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

            <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 2 }}>
                <TripCard
                    tripinfo={
                        {
                        name : "Trip Name Example",
                        description : "Trip Description Example",
                        owner : { tag: "User_Tag" },
                        statics : { Votes: { Total : 0 } },
                        initialdate : null,
                        finaldate : null,
                        id : 0,
                        itinerary : [
                            { 
                                id: 0, 
                                name: "Place Name Example", 
                                location: "Location 1",
                                initialdate : null,
                                finaldate : null,
                                Ubication : { Country : { acronym : "MX" } }
                            }
                        ],
                    }}
                />
            </Box>
            
            <NewTrips />

            </Box>
        </>
        </CenteredTemplate>
    );
 }
 export default MainTrips;