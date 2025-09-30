import React from "react";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, Button, ButtonGroup, List, ListItem, ListItemText } from "@mui/material";
import { Flight, LocationCity, Search } from '@mui/icons-material';

const GenerateUserSection = () => { 
        if( localStorage.getItem('role') === 'Admin' ){
            return (
                <>
                    <Button variant="text" 
                        startIcon={ <Search/> }
                        size="small"
                        href="/SearchPlace" >
                        Search Places
                    </Button>
                    <Button variant="text" 
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
                    href="/SearchPlace" >
                        Search Places
                    </Button>
                </>);
            } else {
                return (
                    <Typography variant="body1" align="right">
                        You need to be logged in to create a place. Please log in or create an account.
                    </Typography>
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
        <>
        <Container maxWidth="sm"  sx={{ py: 8 }}>
        <Box
            sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
            }}
        >
            
        </Box>
            <Typography variant="h5" align="center">
                Places
            </Typography>
            <Typography variant="h6" align="left">
                What is a Place in AdondeVamos?
            </Typography>
            <Typography variant="body1" align="right">
                A place is a location that you want to visit with your friends
            </Typography>
            <Typography variant="h6" align="left">
                What can i see in a Place in AdondeVamos?
            </Typography>
            <List sx={{ width: '80%', alignContent:'center' , bgcolor: 'background.paper' }}>
                <ListItemText 
                    primary="Address" 
                    secondary="Exact location where is this place located" 
                />
                <ListItemText 
                    primary="Description" 
                    secondary="A brief description of the place" 
                />
                <ListItemText 
                    primary="Facilities" 
                    secondary="Facilities that the place offers" 
                />
            </List>
            <ButtonGroup variant="text" aria-label="text button group" fullWidth sx={{ mt: 2, mb: 2 }}>
            {
                UserSection
            }
            </ButtonGroup>
            
        </Container>
        </>
    );
}