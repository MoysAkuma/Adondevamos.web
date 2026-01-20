import React from "react";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button, ButtonGroup, 
    Collapse, Box } from "@mui/material";
import { LocationCity, Search, Person,
    ExpandLess, ExpandMore
 } from '@mui/icons-material';
import PlaceCard from "./PlaceCard";
import NewPlaces from "./NewPlaces";
import CenteredTemplate from "../Commons/CenteredTemplate";
import { useAuth } from "../../context/AuthContext";

export default function MainPlaces() {
    const [UserSection, setUserSection] = useState(null);
    const { isLogged, loading, hasRole, role } = useAuth();
    const [showNewPlaces, setShowNewPlaces] = useState(true);
    
    const GenerateUserSection = () => { 
        if (hasRole('admin')) {
            return (
                <>
                    <Button variant="contained"
                        startIcon={ <Search/> }
                        size="small"
                        href="/Search/Places" >
                        Search Places
                    </Button>
                    <Button variant="outlined" 
                        endIcon={ <LocationCity/> }
                        size="small"
                        href="/Create/Place" >
                        Create Places
                    </Button>
                </>
            );
        } else if (isLogged) {
            // Logged in users can search
            return (
                <>
                    <Button variant="text" 
                        endIcon={ <LocationCity/> }
                        href="/Search/Places" >
                        Search Places
                    </Button>
                </>
            );
        } else {
            return (
                <>
                    <Button 
                        variant="outlined" 
                        startIcon={ <Person/> }
                        href="/login" >
                        Login
                    </Button>
                    <Button variant="contained" 
                        endIcon={ <Search/> }
                        size="small"
                        href="/Search/Places" >
                        Search Places
                    </Button>
                </>
            );
        }
    }
    
    useEffect(() => {
        if (!loading) {
            setUserSection(GenerateUserSection());
        }
    }, [loading, isLogged]);

    return (
        <CenteredTemplate>
        <>
            <Typography variant="h5" 
            align="center">
                Places
            </Typography>
            
            <ButtonGroup variant="contained" 
            color="primary"
            aria-label="text button group" 
            fullWidth sx={{ mt: 2, mb: 4 }}>
            {
                UserSection
            }
            </ButtonGroup>
            <Typography variant="h6" align="left">
                What is a Place in AdondeVamos?
            </Typography>
            <Typography variant="body1" align="right">
                A place is a location that you want to visit with your friends
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" align="left">
                    New Trips
                </Typography>
                <Button 
                    onClick={() => setShowNewPlaces(!showNewPlaces)}
                    endIcon={showNewPlaces ? <ExpandLess /> : <ExpandMore />}
                    size="small"
                >
                    {showNewPlaces ? 'Hide' : 'Show'}
                </Button>
            </Box>
            <Collapse in={showNewPlaces}>
                <NewPlaces />
            </Collapse>
        </>
        </CenteredTemplate>
    );
}