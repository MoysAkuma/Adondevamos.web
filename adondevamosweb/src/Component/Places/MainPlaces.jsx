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
    
    
    
    useEffect(() => {
        if (!loading) {
           
        }
    }, [loading, isLogged]);

    return (
        <CenteredTemplate>
        <>
            <Typography variant="h5" 
            align="center">
                Places
            </Typography>
            
            
            <Typography variant="h6" align="left">
                What is a Place in AdondeVamos?
            </Typography>
            <Typography variant="body1" align="right">
                A place is a location that you want to visit with your friends
            </Typography>
            <Typography variant="h6" align="left">
                Discover Places
            </Typography>
            <Typography variant="body1" align="right">
                Explore places created by other users, locations, and attractions to add to your trips!
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 2 }}>
                <Button variant="outlined"
                    endIcon={ <Search/> }
                    size="small"
                    href="/Search/Places" >
                    Search Places
                </Button>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" align="left">
                    New Places
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