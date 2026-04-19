import { Box, CircularProgress, Alert, Container } from '@mui/material';
import TripCard from "./TripCard";
import TripCardSkeleton from "./TripCardSkeleton";
import useTripById from "../../hooks/Trips/useTripById";

function MushaShugyo() {
    const {
        tripInfo,
        loading,
        error,
        notFound
    } = useTripById(1, {
        fields : ['owner', 'itinerary', 'gallery', 'statics', 'userVoted']
    });

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
                <TripCardSkeleton />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (notFound || !tripInfo) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Alert severity="info">No trip information found</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <TripCard tripinfo={tripInfo}  />
        </Container>
    );
}

export default MushaShugyo;
