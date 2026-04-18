import { useState, useEffect, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import { Map as MapIcon, ZoomIn, ZoomOut, Refresh } from '@mui/icons-material';

/**
 * ItineraryMap Component
 * 
 * Displays a static map with markers for each place in a trip's itinerary.
 * Only renders when there are at least 2 places with valid coordinates.
 * 
 * Features:
 * - Auto-calculates optimal zoom level based on coordinate spread
 * - Shows labeled markers (A, B, C, ...) for each place in sequence
 * - Draws a path connecting all locations
 * - Zoom in/out controls
 * - Responsive design
 * 
 * @param {Object} props
 * @param {Array} props.itinerary - Array of itinerary items with place objects containing latitude/longitude
 * 
 * PRODUCTION NOTE:
 * To use in production, add a Google Maps Static API key:
 * 1. Get an API key from Google Cloud Console
 * 2. Add it to your .env file: REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
 * 3. Update the generateMapUrl function to include: &key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
 */

const StyledMapCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    marginBottom: theme.spacing(3),
    backgroundColor: '#E0AC69',
}));

const StyledMapHeader = styled(Box)(({ theme }) => ({
    backgroundColor: '#52B788',
    padding: theme.spacing(2),
    borderBottom: '4px solid #2C2C2C',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

const StyledMapContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#E0AC69',
    padding: theme.spacing(2),
    '&:last-child': {
        paddingBottom: theme.spacing(2),
    },
}));

const PixelTypography = styled(Typography)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
}));

const MapImageContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    borderRadius: 0,
    border: '3px solid #2C2C2C',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    border: '2px solid #2C2C2C',
    padding: '6px',
    margin: '0 2px',
    color: '#2C2C2C',
    '&:hover': {
        backgroundColor: '#3D5A80',
        color: '#FFFFFF',
        transform: 'translateY(-2px)',
        boxShadow: '2px 2px 0px #2C2C2C',
    },
    '&:disabled': {
        backgroundColor: '#CCCCCC',
        borderColor: '#999999',
        color: '#666666',
    },
}));

const ItineraryMap = ({ itinerary = [] }) => {
    const [zoom, setZoom] = useState(10);
    const [mapSize, setMapSize] = useState({ width: 640, height: 400 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Filter out places without coordinates
    const validPlaces = useMemo(() => {
        const valid = itinerary.filter(item => 
            item?.place?.latitude != null && 
            item?.place?.longitude != null &&
            !isNaN(item.place.latitude) &&
            !isNaN(item.place.longitude)
        );
        
        // Debug logging
        if (itinerary.length > 0 && valid.length === 0) {
            console.log('ItineraryMap: No valid coordinates found in itinerary', itinerary);
        } else if (valid.length > 0) {
            console.log(`ItineraryMap: Found ${valid.length} valid places with coordinates`, valid);
        }
        
        return valid;
    }, [itinerary]);

    // Calculate map center
    const mapCenter = useMemo(() => {
        if (validPlaces.length === 0) return null;
        
        const avgLat = validPlaces.reduce((sum, item) => sum + parseFloat(item.place.latitude), 0) / validPlaces.length;
        const avgLng = validPlaces.reduce((sum, item) => sum + parseFloat(item.place.longitude), 0) / validPlaces.length;
        
        return { lat: avgLat, lng: avgLng };
    }, [validPlaces]);

    // Auto-adjust zoom based on distance between points
    useEffect(() => {
        if (validPlaces.length < 2) {
            setZoom(12);
            return;
        }

        const lats = validPlaces.map(item => parseFloat(item.place.latitude));
        const lngs = validPlaces.map(item => parseFloat(item.place.longitude));
        
        const latDiff = Math.max(...lats) - Math.min(...lats);
        const lngDiff = Math.max(...lngs) - Math.min(...lngs);
        const maxDiff = Math.max(latDiff, lngDiff);
        
        // Auto-calculate zoom level based on coordinate spread
        let calculatedZoom = 12;
        if (maxDiff > 10) calculatedZoom = 5;
        else if (maxDiff > 5) calculatedZoom = 6;
        else if (maxDiff > 2) calculatedZoom = 8;
        else if (maxDiff > 1) calculatedZoom = 9;
        else if (maxDiff > 0.5) calculatedZoom = 10;
        else if (maxDiff > 0.1) calculatedZoom = 11;
        
        setZoom(calculatedZoom);
    }, [validPlaces]);

    // Update map size based on container width
    useEffect(() => {
        const updateSize = () => {
            const container = document.getElementById('map-container');
            if (container) {
                const width = Math.min(640, container.offsetWidth - 20);
                const height = Math.round(width * 0.625); // 16:10 ratio
                setMapSize({ width, height });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Generate Google Maps Static API URL
    const generateMapUrl = () => {
        if (!mapCenter || validPlaces.length < 2) return null;

        const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
        
        // Build markers parameter
        const markers = validPlaces.map((item, index) => {
            const label = String.fromCharCode(65 + index); // A, B, C, ...
            return `markers=color:red%7Clabel:${label}%7C${item.place.latitude},${item.place.longitude}`;
        }).join('&');

        // Build path parameter to connect the points
        const path = validPlaces.map(item => 
            `${item.place.latitude},${item.place.longitude}`
        ).join('|');

        const params = [
            `center=${mapCenter.lat},${mapCenter.lng}`,
            `zoom=${zoom}`,
            `size=${mapSize.width}x${mapSize.height}`,
            `scale=2`,
            markers,
            validPlaces.length > 1 ? `path=color:0x3D5A80%7Cweight:3%7C${path}` : '',
            // Add API key from environment variable if available
            process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? `key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}` : ''
        ].filter(Boolean).join('&');

        return `${baseUrl}?${params}`;
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 1, 20));
        setImageLoaded(false);
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 1, 1));
        setImageLoaded(false);
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
        setImageLoaded(false);
        setImageError(false);
    };

    // Don't render if less than 2 places
    if (validPlaces.length < 2) {
        // Show helpful message if there are places but not enough valid coordinates
        if (itinerary.length >= 2 && validPlaces.length < 2) {
            return (
                <StyledMapCard>
                    <StyledMapHeader>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MapIcon sx={{ color: '#FFFFFF', fontSize: '1.5rem' }} />
                            <PixelTypography
                                variant="h6"
                                sx={{
                                    color: '#FFFFFF',
                                    fontSize: { xs: '0.6rem', sm: '0.8rem' }
                                }}
                            >
                                Trip Route Map
                            </PixelTypography>
                        </Box>
                    </StyledMapHeader>
                    <StyledMapContent>
                        <Alert 
                            severity="info"
                            sx={{
                                borderRadius: 0,
                                border: '2px solid #2C2C2C',
                                backgroundColor: '#DBEAFE',
                                '& .MuiAlert-message': {
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: '0.6rem',
                                    lineHeight: 1.8
                                }
                            }}
                        >
                            Map requires at least 2 places with valid coordinates. 
                            Some places in the itinerary are missing location data.
                        </Alert>
                    </StyledMapContent>
                </StyledMapCard>
            );
        }
        // Don't show anything if less than 2 places in itinerary
        return null;
    }

    const mapUrl = generateMapUrl();

    if (!mapUrl) {
        return null;
    }

    return (
        <StyledMapCard>
            <StyledMapHeader>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MapIcon sx={{ color: '#FFFFFF', fontSize: '1.5rem' }} />
                    <PixelTypography
                        variant="h6"
                        sx={{
                            color: '#FFFFFF',
                            fontSize: { xs: '0.6rem', sm: '0.8rem' }
                        }}
                    >
                        Trip Route Map
                    </PixelTypography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Zoom Out" arrow>
                        <span>
                            <StyledIconButton 
                                size="small" 
                                onClick={handleZoomOut}
                                disabled={zoom <= 1}
                            >
                                <ZoomOut fontSize="small" />
                            </StyledIconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Zoom In" arrow>
                        <span>
                            <StyledIconButton 
                                size="small" 
                                onClick={handleZoomIn}
                                disabled={zoom >= 20}
                            >
                                <ZoomIn fontSize="small" />
                            </StyledIconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Refresh Map" arrow>
                        <StyledIconButton size="small" onClick={handleRefresh}>
                            <Refresh fontSize="small" />
                        </StyledIconButton>
                    </Tooltip>
                </Box>
            </StyledMapHeader>

            <StyledMapContent>
                <MapImageContainer id="map-container">
                    {!imageLoaded && !imageError && (
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                minHeight: 200,
                                backgroundColor: '#f5f5f5'
                            }}
                        >
                            <CircularProgress sx={{ color: '#3D5A80' }} />
                        </Box>
                    )}
                    
                    {imageError && (
                        <Box sx={{ p: 2 }}>
                            <Alert 
                                severity="warning"
                                sx={{
                                    borderRadius: 0,
                                    border: '2px solid #2C2C2C'
                                }}
                            >
                                <PixelTypography sx={{ fontSize: '0.6rem', lineHeight: 1.8 }}>
                                    Map could not be loaded. Check coordinates or API key configuration.
                                </PixelTypography>
                            </Alert>
                        </Box>
                    )}

                    <img
                        key={refreshKey}
                        src={mapUrl}
                        alt="Trip itinerary map"
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: imageLoaded ? 'block' : 'none'
                        }}
                        onLoad={() => {
                            setImageLoaded(true);
                            setImageError(false);
                        }}
                        onError={() => {
                            setImageError(true);
                            setImageLoaded(false);
                        }}
                    />
                </MapImageContainer>

                <Box sx={{ mt: 2 }}>
                    <PixelTypography 
                        variant="caption" 
                        sx={{ 
                            fontSize: '0.5rem', 
                            color: '#2C2C2C',
                            lineHeight: 1.8
                        }}
                    >
                        {validPlaces.length} location{validPlaces.length !== 1 ? 's' : ''} • 
                        Markers show route sequence (A → {String.fromCharCode(64 + validPlaces.length)})
                    </PixelTypography>
                </Box>
            </StyledMapContent>
        </StyledMapCard>
    );
};

export default ItineraryMap;
