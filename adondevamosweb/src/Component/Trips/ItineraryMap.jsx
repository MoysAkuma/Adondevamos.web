import { useState, useEffect, useMemo, useRef } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Alert,
    IconButton,
    Tooltip
} from '@mui/material';
import { Map as MapIcon, ZoomIn, ZoomOut, Refresh, MyLocation } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * ItineraryMap Component
 * 
 * Displays an interactive map with markers for each place in a trip's itinerary.
 * Only renders when there are at least 2 places with valid coordinates.
 * 
 * Features:
 * - Interactive Leaflet map with OpenStreetMap tiles
 * - Auto-calculates optimal zoom level based on coordinate spread
 * - Shows labeled markers (A, B, C, ...) for each place in sequence
 * - Draws a path connecting all locations
 * - Zoom in/out and fit bounds controls
 * - Responsive design
 * 
 * @param {Object} props
 * @param {Array} props.itinerary - Array of itinerary items with place objects containing latitude/longitude
 * 
 * DEPENDENCIES:
 * Install required packages: npm install react-leaflet leaflet
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

const MapContainer_Styled = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    height: '400px',
    borderRadius: 0,
    border: '3px solid #2C2C2C',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
    '& .leaflet-container': {
        height: '100%',
        width: '100%',
    },
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

// Create custom numbered marker icons
const createNumberedIcon = (number) => {
    const label = String.fromCharCode(65 + number); // A, B, C, ...
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                background-color: #EF4444;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                border: 3px solid #2C2C2C;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Press Start 2P', cursive;
                font-size: 12px;
                font-weight: bold;
                transform: rotate(-45deg);
                box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            ">
                <span style="transform: rotate(45deg);">${label}</span>
            </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });
};

// Component to fit map bounds to markers
const FitBounds = ({ bounds }) => {
    const map = useMap();
    
    useEffect(() => {
        if (bounds && bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, bounds]);
    
    return null;
};

const ItineraryMap = ({ itinerary = [] }) => {
    const [zoom, setZoom] = useState(10);
    const [refreshKey, setRefreshKey] = useState(0);
    const mapRef = useRef(null);

    // Filter out places without valid coordinates
    const validPlaces = useMemo(() => {
        const valid = itinerary.filter(item => {
            // Check if place exists
            if (!item?.place) return false;
            
            const { latitude, longitude } = item.place;
            
            // Check if both lat and lng exist and are not null/undefined
            if (latitude == null || longitude == null) return false;
            
            // Check if both are valid numbers
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);
            
            if (isNaN(lat) || isNaN(lng)) return false;
            
            // Check if within valid ranges
            if (lat < -90 || lat > 90) return false;
            if (lng < -180 || lng > 180) return false;
            
            return true;
        });
        
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

    // Calculate bounds for all markers
    const bounds = useMemo(() => {
        if (validPlaces.length === 0) return null;
        
        return validPlaces.map(item => [
            parseFloat(item.place.latitude),
            parseFloat(item.place.longitude)
        ]);
    }, [validPlaces]);

    // Prepare polyline coordinates
    const polylinePositions = useMemo(() => {
        return validPlaces.map(item => [
            parseFloat(item.place.latitude),
            parseFloat(item.place.longitude)
        ]);
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

    const handleZoomIn = () => {
        if (mapRef.current) {
            mapRef.current.zoomIn();
        }
    };

    const handleZoomOut = () => {
        if (mapRef.current) {
            mapRef.current.zoomOut();
        }
    };

    const handleFitBounds = () => {
        if (mapRef.current && bounds && bounds.length > 0) {
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
        handleFitBounds();
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

    if (!mapCenter) {
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
                        <StyledIconButton 
                            size="small" 
                            onClick={handleZoomOut}
                        >
                            <ZoomOut fontSize="small" />
                        </StyledIconButton>
                    </Tooltip>
                    <Tooltip title="Zoom In" arrow>
                        <StyledIconButton 
                            size="small" 
                            onClick={handleZoomIn}
                        >
                            <ZoomIn fontSize="small" />
                        </StyledIconButton>
                    </Tooltip>
                    <Tooltip title="Fit to View" arrow>
                        <StyledIconButton 
                            size="small" 
                            onClick={handleFitBounds}
                        >
                            <MyLocation fontSize="small" />
                        </StyledIconButton>
                    </Tooltip>
                    <Tooltip title="Refresh Map" arrow>
                        <StyledIconButton size="small" onClick={handleRefresh}>
                            <Refresh fontSize="small" />
                        </StyledIconButton>
                    </Tooltip>
                </Box>
            </StyledMapHeader>

            <StyledMapContent>
                <MapContainer_Styled key={refreshKey}>
                    <MapContainer
                        center={[mapCenter.lat, mapCenter.lng]}
                        zoom={zoom}
                        scrollWheelZoom={true}
                        ref={mapRef}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        {/* Fit bounds on mount/update */}
                        <FitBounds bounds={bounds} />
                        
                        {/* Draw polyline connecting all points */}
                        {polylinePositions.length > 1 && (
                            <Polyline
                                positions={polylinePositions}
                                color="#3D5A80"
                                weight={4}
                                opacity={0.8}
                            />
                        )}
                        
                        {/* Render markers for each place */}
                        {validPlaces.map((item, index) => (
                            <Marker
                                key={`${item.place.id}-${index}`}
                                position={[
                                    parseFloat(item.place.latitude),
                                    parseFloat(item.place.longitude)
                                ]}
                                icon={createNumberedIcon(index)}
                                title={item.place.name || `Stop ${index + 1}`}
                            />
                        ))}
                    </MapContainer>
                </MapContainer_Styled>

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
