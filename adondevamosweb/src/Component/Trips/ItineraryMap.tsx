import { useState, useEffect, useMemo, useRef } from 'react';
import {
    Box,
    Typography,
    Alert,
    Tooltip
} from '@mui/material';
import { Map as MapIcon, ZoomIn, ZoomOut, Refresh, MyLocation } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link as RouterLink } from 'react-router-dom';
import {
    ItineraryMapCard,
    ItineraryMapHeader,
    ItineraryMapContent,
    ItineraryMapTitle,
    ItineraryMapContainer,
    ItineraryMapActionButton,
    itineraryMapHeaderRowSx,
    itineraryMapIconSx,
    itineraryMapTitleSx,
    itineraryMapActionsRowSx,
    itineraryMapInfoAlertSx,
    itineraryMapPopupBoxSx,
    itineraryMapPopupTitleSx,
    itineraryMapFooterBoxSx,
    itineraryMapFooterTextSx,
} from '../../Css/Trips/trips.styles';

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

    // Sort itinerary by initial date
    const sortedItinerary = useMemo(() => {
        return [...itinerary].sort((a, b) => {
            // Parse initial dates
            const dateA = new Date(a.initialdate);
            const dateB = new Date(b.initialdate);
            
            // Primary sort by initial date
            const initialDateComparison = dateA.getTime() - dateB.getTime();
            
            // If initial dates are the same, sort by final date
            if (initialDateComparison === 0 && a.finaldate && b.finaldate) {
                const finalDateA = new Date(a.finaldate);
                const finalDateB = new Date(b.finaldate);
                return finalDateA.getTime() - finalDateB.getTime();
            }
            
            return initialDateComparison;
        });
    }, [itinerary]);

    // Filter out places without valid coordinates
    const validPlaces = useMemo(() => {
        const valid = sortedItinerary.filter(item => {
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
        
        return valid;
    }, [sortedItinerary]);

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
        if (sortedItinerary.length >= 2 && validPlaces.length < 2) {
            return (
                <ItineraryMapCard>
                    <ItineraryMapHeader>
                        <Box sx={itineraryMapHeaderRowSx}>
                            <MapIcon sx={itineraryMapIconSx} />
                            <ItineraryMapTitle
                                variant="h6"
                                sx={itineraryMapTitleSx}
                            >
                                Trip Route Map
                            </ItineraryMapTitle>
                        </Box>
                    </ItineraryMapHeader>
                    <ItineraryMapContent>
                        <Alert 
                            severity="info"
                            sx={itineraryMapInfoAlertSx}
                        >
                            Map requires at least 2 places with valid coordinates. 
                            Some places in the itinerary are missing location data.
                        </Alert>
                    </ItineraryMapContent>
                </ItineraryMapCard>
            );
        }
        // Don't show anything if less than 2 places in itinerary
        return null;
    }

    if (!mapCenter) {
        return null;
    }

    return (
        <ItineraryMapCard>
            <ItineraryMapHeader>
                <Box sx={itineraryMapHeaderRowSx}>
                    <MapIcon sx={itineraryMapIconSx} />
                    <ItineraryMapTitle
                        variant="h6"
                        sx={itineraryMapTitleSx}
                    >
                        Trip Route Map
                    </ItineraryMapTitle>
                </Box>
                <Box sx={itineraryMapActionsRowSx}>
                    <Tooltip title="Zoom Out" arrow>
                        <ItineraryMapActionButton 
                            size="small" 
                            onClick={handleZoomOut}
                        >
                            <ZoomOut fontSize="small" />
                        </ItineraryMapActionButton>
                    </Tooltip>
                    <Tooltip title="Zoom In" arrow>
                        <ItineraryMapActionButton 
                            size="small" 
                            onClick={handleZoomIn}
                        >
                            <ZoomIn fontSize="small" />
                        </ItineraryMapActionButton>
                    </Tooltip>
                    <Tooltip title="Fit to View" arrow>
                        <ItineraryMapActionButton 
                            size="small" 
                            onClick={handleFitBounds}
                        >
                            <MyLocation fontSize="small" />
                        </ItineraryMapActionButton>
                    </Tooltip>
                    <Tooltip title="Refresh Map" arrow>
                        <ItineraryMapActionButton size="small" onClick={handleRefresh}>
                            <Refresh fontSize="small" />
                        </ItineraryMapActionButton>
                    </Tooltip>
                </Box>
            </ItineraryMapHeader>

            <ItineraryMapContent>
                <ItineraryMapContainer key={refreshKey}>
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
                            >
                                <Popup>
                                    <Box sx={itineraryMapPopupBoxSx}>
                                        <Typography sx={itineraryMapPopupTitleSx}>
                                            {String.fromCharCode(65 + index)}. {item.place.name || `Stop ${index + 1}`}
                                        </Typography>
                                        <RouterLink 
                                            to={`/View/Place/${item.place.id}`}
                                            style={{
                                                fontFamily: "'Press Start 2P', cursive",
                                                fontSize: '0.5rem',
                                                textDecoration: 'none',
                                                display: 'inline-block',
                                                padding: '4px 8px',
                                                border: '2px solid #2C2C2C',
                                                backgroundColor: '#52B788',
                                                color: '#FFFFFF',
                                                borderRadius: '0',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#40916C';
                                                e.target.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#52B788';
                                                e.target.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            View Place
                                        </RouterLink>
                                    </Box>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </ItineraryMapContainer>

                <Box sx={itineraryMapFooterBoxSx}>
                    <ItineraryMapTitle 
                        variant="caption" 
                        sx={itineraryMapFooterTextSx}
                    >
                        {validPlaces.length} location{validPlaces.length !== 1 ? 's' : ''} • 
                        Markers show route sequence (A → {String.fromCharCode(64 + validPlaces.length)})
                    </ItineraryMapTitle>
                </Box>
            </ItineraryMapContent>
        </ItineraryMapCard>
    );
};

export default ItineraryMap;
