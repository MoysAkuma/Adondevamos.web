import React from "react";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button, ButtonGroup, 
    Collapse, Box, useMediaQuery,
  useTheme } from "@mui/material";
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
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
    
    
    useEffect(() => {
        if (!loading) {
           
        }
    }, [loading, isLogged]);

    return (
        <CenteredTemplate>
        <>
            <Typography 
                variant={isSmUp ? "h3" : "h4"} 
                align="center"
                sx={{
                    fontFamily: "'Press Start 2P', cursive",
                    color: '#2c3e50',
                    fontSize: isSmUp ? '1.5rem' : '1.2rem',
                    lineHeight: 1.6,
                    mb: 1,
                    textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
                }}
            >
                Places
            </Typography>
            
            
            <Typography variant="h6" 
            sx={{
                    fontFamily: "'Press Start 2P', cursive",
                    color: '#2c3e50',
                    fontSize: isSmUp ? '0.8rem' : '0.9rem',
                    lineHeight: .8,
                    mb: 1,
                    textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
                }}
            align="left">
                What is a Place in AdondeVamos?
            </Typography>
            <Typography variant="body1" align="right">
                A place is a location that you want to visit with your friends
            </Typography>
            <Typography variant="h6" 
            align="left"
            sx={{
                    fontFamily: "'Press Start 2P', cursive",
                    color: '#2c3e50',
                    fontSize: isSmUp ? '0.8rem' : '0.9rem',
                    lineHeight: .8,
                    mb: 1,
                    textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
                }}
            >
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
                <Typography variant="h6" 
                sx={{
                    fontFamily: "'Press Start 2P', cursive",
                    color: '#2c3e50',
                    fontSize: isSmUp ? '0.8rem' : '0.9rem',
                    lineHeight: .8,
                    mb: 1,
                    textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
                }}
                align="left">
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