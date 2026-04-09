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

function NewTrips({ topTrips = [] }){
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

    // Function to check if a trip is in the top ranking and get its position
    const getTripRankingInfo = (tripId) => {
        const foundTrip = topTrips.find(trip => trip.id === tripId);
        if (foundTrip) {
            const position = topTrips.indexOf(foundTrip) + 1;
            return { isRanked: true, position };
        }
        return { isRanked: false, position: null };
    };

    if (isLoading) return (<CircularProgress />);
    if (error) {
      return (
        <Alert severity="error">
          {error}
        </Alert>
      );
    }

    return (<>
      <Stack spacing={2} 
        divider={<Divider />}
        sx={{ overflowX: 'auto', padding: 1, marginTop: 1 }}>
        {
          NewTripsList.length > 0 ? NewTripsList.map( (x) => {
            const rankingInfo = getTripRankingInfo(x.id);
            return (
              <TripCard 
                tripinfo={x} 
                key={x.id || x.name} 
                showRankingBadge={rankingInfo.isRanked}
                rankingPosition={rankingInfo.position}
              />
            );
          }) :
            (<Typography variant="span" 
              component="span" 
              gutterBottom align="left">
              No trips added yet. Please create and user and help me!
            </Typography>)
        }
        </Stack>
    </>
    );
}
export default NewTrips;