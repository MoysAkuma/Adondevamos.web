import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Container,
        Typography,
        Box,
        MenuItem,
        FormGroup,
        FormControlLabel,
        Checkbox
        
    } from '@mui/material';
import  NewTrips  from "../Component/NewTrips";
import  MostVotedPlaces  from "../Component/MostVotedPlaces";


function Home() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    
    return (
      <div className="App">
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Typography variant="h3"  gutterBottom align="center">
              ¿A donde vamos?
            </Typography>
            <Typography variant="h5"  gutterBottom align="center">
              What is Adondevamos.io?
            </Typography>
            <Typography variant="body1" gutterBottom align="center">
              Adondevamos.io is a website to share your trip info and itinerary with friend, vote where yo wanted to go and share to others!
            </Typography>
            <NewTrips/>
            <MostVotedPlaces />
          </Container>
          </div>
    );
  };
  export default Home;