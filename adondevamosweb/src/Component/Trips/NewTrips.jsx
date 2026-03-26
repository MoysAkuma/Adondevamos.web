import React from "react";
import TripCard from "./TripCard";
import { useAuth } from '../../context/AuthContext';
import useLastedTrips from '../../hooks/Trips/useLastedTrips';
import 
    {
        Typography,
        Stack,
        Divider,
        Paper,
        CircularProgress,
        Alert
    } from '@mui/material';

// Define fields outside component to keep reference stable
const TRIP_CARD_FIELDS = ['owner', 'itinerary', 'gallery', 'statics', 'userVoted'];

function NewTrips(){
    const { isLogged, user } = useAuth();
    const {
      trips: NewTripsList,
      loading: isLoading,
      error
    } = useLastedTrips(3, {
      includeUserHeader: isLogged,
      userId: user,
      fields: TRIP_CARD_FIELDS // Optimized for TripCard
    });

    if (isLoading) return (<CircularProgress />);
    if (error) {
      return (
        <Alert severity="error">
          {error}
        </Alert>
      );
    }

    return (<>
      <Paper
        elevation={1}
        sx={{ p : 2, borderRadius : 2, backgroundColor : "rgba(255, 255, 255, 0.9)"}}
      >
        <Stack spacing={2} 
      divider={<Divider />}
      sx={{ overflowX: 'auto', padding: 1, marginTop: 1 }}>
        {
            NewTripsList.length > 0 ? NewTripsList.map( (x) => 
              (<TripCard tripinfo={x} key={x.id || x.name} />)) :
              (<Typography variant="span" 
                component="span" 
                gutterBottom align="left">
                No trips added yet. Please create and user and help me!
              </Typography>)
        }
        </Stack>
      </Paper>
      
    </>
    );
}
export default NewTrips;