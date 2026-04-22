import { Box, Typography, Paper, TextField, Button, Stack, IconButton, Tooltip, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocationOn, MyLocation, OpenInNew, ZoomIn, ZoomOut, CenterFocusStrong, Refresh } from '@mui/icons-material';
import { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * LocationPicker - Interactive map component to select a location using Leaflet
 * Features: Click to place marker, drag marker, geolocation, read-only coordinate display
 * Coordinates are controlled by map interaction only (not manually editable)
 * 
 * @param {Object} props
 * @param {number} props.latitude - Initial latitude coordinate
 * @param {number} props.longitude - Initial longitude coordinate
 * @param {function} props.onChange - Callback when location changes (lat, lng)
 * @param {number} props.zoom - Map zoom level (default: 13)
 * @param {number} props.height - Map height (default: 400)
 * @param {boolean} props.retroStyle - Use retro 8-bit styling (default: false)
 * 
 * DEPENDENCIES: 
 * npm install react-leaflet leaflet
 */

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== '$retro',
})(({ theme, $retro }) => ({
  overflow: 'hidden',
  borderRadius: $retro ? 0 : theme.spacing(2),
  border: $retro ? '4px solid #2C2C2C' : 'none',
  boxShadow: $retro ? '8px 8px 0px rgba(0,0,0,0.3)' : theme.shadows[2],
  padding: theme.spacing(2),
  backgroundColor: $retro ? '#E0AC69' : '#FFFFFF',
}));

const MapContainer_Styled = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$retro',
})(({ theme, $retro }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: $retro ? 0 : theme.spacing(1),
  border: $retro ? '3px solid #2C2C2C' : '1px solid rgba(0, 0, 0, 0.12)',
  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
  boxShadow: $retro ? '4px 4px 0px rgba(0,0,0,0.2)' : theme.shadows[1],
  '& .leaflet-container': {
    height: '100%',
    width: '100%',
    cursor: 'crosshair',
  },
}));

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== '$retro',
})(({ theme, $retro }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: $retro ? 0 : '4px',
  border: $retro ? '2px solid #2C2C2C' : '1px solid rgba(0, 0, 0, 0.2)',
  padding: '6px',
  margin: '2px',
  color: '#2C2C2C',
  '&:hover': {
    backgroundColor: $retro ? '#3D5A80' : '#f5f5f5',
    color: $retro ? '#FFFFFF' : '#2C2C2C',
    transform: $retro ? 'translateY(-2px)' : 'none',
    boxShadow: $retro ? '2px 2px 0px #2C2C2C' : theme.shadows[2],
  },
}));

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== '$retro',
})(({ theme, $retro }) => ({
  borderRadius: $retro ? 0 : theme.shape.borderRadius,
  border: $retro ? '3px solid #2C2C2C' : undefined,
  boxShadow: $retro ? '4px 4px 0px rgba(0,0,0,0.3)' : undefined,
  fontFamily: $retro ? "'Press Start 2P', cursive" : undefined,
  fontSize: $retro ? '0.6rem' : undefined,
  '&:hover': {
    transform: $retro ? 'translate(2px, 2px)' : 'none',
    boxShadow: $retro ? '2px 2px 0px rgba(0,0,0,0.3)' : undefined,
  },
}));

const PixelTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.8rem',
  lineHeight: 1.6,
}));

// Create draggable marker icon
const createDraggableIcon = () => {
  return L.divIcon({
    className: 'custom-draggable-marker',
    html: `
      <div style="
        background-color: #10B981;
        color: white;
        width: 35px;
        height: 35px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid #2C2C2C;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transform: rotate(-45deg);
        box-shadow: 2px 2px 6px rgba(0,0,0,0.4);
        cursor: move;
      ">
        <span style="transform: rotate(45deg);">📍</span>
      </div>
    `,
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
  });
};

// Component to handle map clicks
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

// Component to recenter map (optimized - no auto-recenter)
const RecenterMap = ({ center, zoom }) => {
  const map = useMap();
  const hasInitialized = useRef(false);
  
  useEffect(() => {
    // Only set view on initial mount, not on every position change
    if (!hasInitialized.current && center) {
      map.setView(center, zoom);
      hasInitialized.current = true;
    }
  }, [center, zoom, map]);
  
  return null;
};

function LocationPicker({ 
  latitude = 24.8091, 
  longitude = -107.3940, 
  onChange,
  zoom = 13,
  height = 400,
  retroStyle = false
}) {
  const [lat, setLat] = useState(latitude);
  const [lng, setLng] = useState(longitude);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [geoError, setGeoError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Validate coordinates helper function
  const isValidCoordinate = (latitude, longitude) => {
    return (
      latitude !== '' && 
      longitude !== '' && 
      !isNaN(latitude) && 
      !isNaN(longitude) &&
      latitude >= -90 && 
      latitude <= 90 && 
      longitude >= -180 && 
      longitude <= 180
    );
  };

  useEffect(() => {
    const newLat = Number(latitude);
    const newLng = Number(longitude);
    // Only update if provided coordinates are valid
    if (isValidCoordinate(newLat, newLng)) {
      setLat(newLat);
      setLng(newLng);
    } else {
      console.warn('Invalid initial coordinates provided:', { latitude, longitude });
    }
  }, [latitude, longitude]);

  const position = useMemo(() => [lat, lng], [lat, lng]);

  // Normalize longitude to -180 to 180 range
  const normalizeLongitude = (lng) => {
    // Wrap longitude to -180 to 180 range
    let normalized = lng % 360;
    if (normalized > 180) {
      normalized -= 360;
    } else if (normalized < -180) {
      normalized += 360;
    }
    return normalized;
  };

  const handleLocationSelect = (newLat, newLng) => {
    // Normalize longitude in case it wraps around the map
    const normalizedLng = normalizeLongitude(newLng);
    
    // Clamp latitude to valid range
    const clampedLat = Math.max(-90, Math.min(90, newLat));
    
    // Only update if coordinates are valid after normalization
    if (!isValidCoordinate(clampedLat, normalizedLng)) {
      console.warn('Invalid coordinates rejected:', { lat: newLat, lng: newLng, normalized: { lat: clampedLat, lng: normalizedLng } });
      return;
    }
    
    setLat(clampedLat);
    setLng(normalizedLng);
    if (onChange) {
      onChange(clampedLat, normalizedLng);
    }
  };

  const handleMarkerDragEnd = (e) => {
    try {
      const marker = e.target;
      const position = marker.getLatLng();
      handleLocationSelect(position.lat, position.lng);
    } catch (error) {
      console.error('Error during marker drag end:', error);
    }
  };

  const handleCurrentLocation = () => {
    setGeoError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;
          handleLocationSelect(newLat, newLng);
        },
        (error) => {
          // Handle different geolocation errors
          let errorMessage = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location permissions in your browser.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable. Please try again.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage = 'Unable to get your location. Please click on the map to set location.';
              break;
          }
          setGeoError(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setGeoError('Geolocation is not supported by your browser.');
    }
  };

  const handleOpenInOSM = () => {
    window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${currentZoom}/${lat}/${lng}`, '_blank');
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
      setCurrentZoom(prev => Math.min(prev + 1, 19));
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
      setCurrentZoom(prev => Math.max(prev - 1, 3));
    }
  };

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], currentZoom);
    }
  };

  const handleRefreshMap = () => {
    setRefreshKey(prev => prev + 1);
    // Optionally recenter after refresh
    setTimeout(() => {
      if (mapRef.current && isValidCoordinate(lat, lng)) {
        mapRef.current.setView([lat, lng], currentZoom);
      }
    }, 100);
  };

  const isValidCoordinates = isValidCoordinate(lat, lng);

  return (
    <StyledPaper elevation={2} $retro={retroStyle}>
      <Stack spacing={2}>
        {retroStyle ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn sx={{ color: '#10B981', fontSize: '1.5rem' }} />
            <PixelTypography variant="h6">
              Select Location
            </PixelTypography>
          </Box>
        ) : (
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn color="success" />
            Select Location
          </Typography>
        )}

        {geoError && (
          <Alert 
            severity="warning" 
            onClose={() => setGeoError('')}
            sx={{
              borderRadius: retroStyle ? 0 : undefined,
              border: retroStyle ? '2px solid #2C2C2C' : undefined,
              fontFamily: retroStyle ? "'Press Start 2P', cursive" : undefined,
              fontSize: retroStyle ? '0.5rem' : undefined,
            }}
          >
            {geoError}
          </Alert>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Latitude"
            type="number"
            value={lat}
            InputProps={{ 
              readOnly: true,
            }}
            inputProps={{ 
              step: 0.000001,
              min: -90,
              max: 90
            }}
            size="small"
            fullWidth
            helperText="Set by clicking map"
            sx={{
              '& .MuiOutlinedInput-root': retroStyle ? {
                borderRadius: 0,
                border: '2px solid #2C2C2C',
                '& fieldset': { border: 'none' },
                backgroundColor: '#f5f5f5'
              } : {
                backgroundColor: '#f5f5f5'
              }
            }}
          />
          <TextField
            label="Longitude"
            type="number"
            value={lng}
            InputProps={{ 
              readOnly: true,
            }}
            inputProps={{ 
              step: 0.000001,
              min: -180,
              max: 180
            }}
            size="small"
            fullWidth
            helperText="Set by clicking map"
            sx={{
              '& .MuiOutlinedInput-root': retroStyle ? {
                borderRadius: 0,
                border: '2px solid #2C2C2C',
                '& fieldset': { border: 'none' },
                backgroundColor: '#f5f5f5'
              } : {
                backgroundColor: '#f5f5f5'
              }
            }}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <StyledButton 
            variant="contained"
            color="success"
            startIcon={<MyLocation />}
            onClick={handleCurrentLocation}
            size="small"
            $retro={retroStyle}
          >
            Use My Location
          </StyledButton>
        </Stack>

        <Box sx={{ position: 'relative', height: height }}>
          {isValidCoordinates ? (
            <MapContainer_Styled $retro={retroStyle} key={refreshKey}>
              <MapContainer
                center={position}
                zoom={currentZoom}
                scrollWheelZoom={true}
                ref={mapRef}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                attributionControl={true}
                preferCanvas={true}
                zoomAnimation={true}
                fadeAnimation={true}
                markerZoomAnimation={true}
                inertia={true}
                inertiaDeceleration={3000}
                inertiaMaxSpeed={1500}
                worldCopyJump={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapClickHandler onLocationSelect={handleLocationSelect} />
                <RecenterMap center={position} zoom={currentZoom} />
                
                <Marker
                  position={position}
                  icon={createDraggableIcon()}
                  draggable={true}
                  eventHandlers={{
                    dragend: handleMarkerDragEnd
                  }}
                  ref={markerRef}
                  autoPan={true}
                  autoPanSpeed={10}
                />
              </MapContainer>

              {/* Zoom controls */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Tooltip title="Zoom In" arrow placement="left">
                  <StyledIconButton 
                    size="small" 
                    onClick={handleZoomIn}
                    $retro={retroStyle}
                  >
                    <ZoomIn fontSize="small" />
                  </StyledIconButton>
                </Tooltip>
                <Tooltip title="Zoom Out" arrow placement="left">
                  <StyledIconButton 
                    size="small" 
                    onClick={handleZoomOut}
                    $retro={retroStyle}
                  >
                    <ZoomOut fontSize="small" />
                  </StyledIconButton>
                </Tooltip>
                <Tooltip title="Recenter" arrow placement="left">
                  <StyledIconButton 
                    size="small" 
                    onClick={handleRecenter}
                    $retro={retroStyle}
                  >
                    <CenterFocusStrong fontSize="small" />
                  </StyledIconButton>
                </Tooltip>
                <Tooltip title="Refresh Map" arrow placement="left">
                  <StyledIconButton 
                    size="small" 
                    onClick={handleRefreshMap}
                    $retro={retroStyle}
                  >
                    <Refresh fontSize="small" />
                  </StyledIconButton>
                </Tooltip>
              </Box>
            </MapContainer_Styled>
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f5f5f5',
                border: '1px dashed #ccc',
                borderRadius: retroStyle ? 0 : 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Enter valid coordinates to display map
              </Typography>
            </Box>
          )}
        </Box>

        <Alert 
          severity="info"
          sx={{
            borderRadius: retroStyle ? 0 : undefined,
            border: retroStyle ? '2px solid #2C2C2C' : undefined,
            fontFamily: retroStyle ? "'Press Start 2P', cursive" : undefined,
            fontSize: retroStyle ? '0.5rem' : undefined,
            lineHeight: retroStyle ? 1.8 : undefined,
          }}
        >
          💡 Click anywhere on the map or drag the marker to set location. Coordinates are automatically updated and read-only.
        </Alert>
      </Stack>
    </StyledPaper>
  );
}

export default LocationPicker;
