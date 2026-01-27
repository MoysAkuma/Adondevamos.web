import { useState, useEffect } from "react";
import { Box, CircularProgress, Alert, Container } from '@mui/material';
import axios from 'axios';
import config from "../../Resources/config";
import TripCard from "./TripCard";

function MushaShugyo() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tripInfo, setTripInfo] = useState(null);

    const tripsURL = `${config.api.baseUrl}${config.api.endpoints.Trips}`;

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get(`${tripsURL}/1`);
                console.log('Fetched trip:', response.data);
                setTripInfo(response.data.info);
            } catch (err) {
                console.error('Error fetching trip:', err);
                setError(err.response?.data?.message || 'Failed to fetch trip information');
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();
    }, [tripsURL]);

    if (loading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="400px"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!tripInfo) {
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
