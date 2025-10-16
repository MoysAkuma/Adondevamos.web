import React from "react";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, Button, ButtonGroup, List, ListItem, ListItemText } from "@mui/material";
import { Flight, LocationCity, Search, Person } from '@mui/icons-material';
import PlaceCard from "./PlaceCard";
import CenteredTemplate from "../Commons/CenteredTemplate";

const GenerateUserSection = () => { 
        if( localStorage.getItem('role') === 'Admin' ){
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
                        href="/CreatePlace" >
                        Create Places
                    </Button>
                </>
            );
        } else if (localStorage.getItem('userid') != null){
            return (
                <>
                    <Button variant="text" 
                    endIcon={ <LocationCity/> }
                    href="/Search/Places" >
                        Search Places
                    </Button>
                </>);
            } else {
                return (
                    <>
                        <Button 
                        variant="outlined" 
                        startIcon={ <Person/> }
                        href="/login" >
                            Login or Create account
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

export default function MainPlaces() {
    const [isUser, setIsUser] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [UserSection, setUserSection] = useState(null);
    

    useEffect(()=> {
        setUserSection(GenerateUserSection());
    },[]);

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
            <Typography variant="h6" align="left">
                What can i see in a Place in AdondeVamos?
            </Typography>
            <PlaceCard placeinfo={{
                name: "Place Name",
                address: "Address of place",
                description: "Place Description",
                facilities: "Wc, Parking, Wifi",
                statics: {Votes: {Total: '0'}},
                id: 0
            }} />
        </>
        </CenteredTemplate>
    );
}