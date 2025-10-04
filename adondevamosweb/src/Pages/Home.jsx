import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 
    {
        useMediaQuery,
        useTheme,
        Container,
        Typography
    } from '@mui/material';
import  NewTrips  from "../Component/Trips/NewTrips";
import  MostVotedPlaces  from "../Component/MostVotedPlaces";


function Home() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    
    return (
      <div className="App">
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Typography variant="h3"  gutterBottom align="center" >
              ¿A donde vamos?
            </Typography>
            
            <Typography variant="h5"  gutterBottom align="center">
              What is Adondevamos.io?
            </Typography>

            <Typography variant="body1" gutterBottom align="center">
              Is a website to create a list of places yo want to go on a trip and share with your friends.
            </Typography>

            <NewTrips/>
            
          </Container>
          </div>
    );
  };
  export default Home;