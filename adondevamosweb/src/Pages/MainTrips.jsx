import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 
{
    Stack, 
    Button,
    CircularProgress,
    Typography,
    Box,
    ButtonGroup,
    Collapse
} from '@mui/material';
import { Flight, Search, Person, ExpandMore, ExpandLess } from '@mui/icons-material';
import TripCard from "../Component/Trips/TripCard";
import NewTrips from "../Component/Trips/NewTrips";
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import { useAuth } from "../context/AuthContext";

 const MainTrips = () => {
    const { isLogged, loading, hasRole, role } = useAuth();
    const [UserSection, setUserSection] = useState(null);
    const [showNewTrips, setShowNewTrips] = useState(true);

    const GenerateBottonSection = () => { 
        if( hasRole('admin') ) {
            return (
                <>
                    
                    <Button 
                        variant="contained"
                        startIcon={ <Flight/> }
                        href="/Create/Trip" 
                        >
                        Add new trip
                    </Button>
                    <Button variant="outlined"
                        endIcon={ <Search/> }
                        href="/Search/Trips" >
                        Search for trips
                    </Button>
                </>
            );
        } else {
            return (
                <>  
                    <Button 
                        variant="contained" 
                        startIcon={ <Person/> }
                        href="/login" >
                        Login
                    </Button>
                    <Button variant="outlined"
                        endIcon={ <Search/> }
                        href="/Search/Trips" >
                        Search for trips
                    </Button>
                </>
            );
        }
    }

    useEffect(()=> {
        if (!loading) {
            setUserSection(GenerateBottonSection());
        }
    },[loading]);

    return (
        <CenteredTemplate>
        <>
            <Typography 
                variant="h5" 
                align="center" 
                >
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
                <ButtonGroup 
                    variant="contained" 
                    color="primary" 
                    fullWidth sx={{ mt: 2, mb: 4 }}>
                        {
                           UserSection
                        }
                </ButtonGroup>
            
                <Typography variant="h6" align="left">
                    What is a Trip in AdondeVamos?
                </Typography>
                <Typography variant="body1" align="right">
                    A trip is a list of places you want to visit with your friends.
                </Typography>
                
                <Typography variant="h6" align="left">
                    Discover Trips
                </Typography>
                <Typography variant="body1" align="right">
                    Explore trips created by other users and get inspired for your next adventure!
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" align="left">
                        New Trips
                    </Typography>
                    <Button 
                        onClick={() => setShowNewTrips(!showNewTrips)}
                        endIcon={showNewTrips ? <ExpandLess /> : <ExpandMore />}
                        size="small"
                    >
                        {showNewTrips ? 'Hide' : 'Show'}
                    </Button>
                </Box>
                <Collapse in={showNewTrips}>
                    <NewTrips />
                </Collapse>
            </Box>
        </>
        </CenteredTemplate>
    );
 }
 export default MainTrips;