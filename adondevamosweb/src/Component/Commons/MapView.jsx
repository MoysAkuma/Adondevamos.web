import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocationOn, ZoomIn, ZoomOut, MyLocation } from '@mui/icons-material';
import { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * MapView - A reusable component to display a location on an interactive Leaflet map
 * Uses the same Leaflet library as ItineraryMap
 * 
 * @param {Object} props
 * @param {number} props.latitude - Latitude coordinate
 * @param {number} props.longitude - Longitude coordinate
 * @param {string} props.address - Address to display
 * @param {string} props.placeName - Name of the place
 * @param {number} props.zoom - Map zoom level (default: 15)
 * @param {string} props.width - Map width (default: '100%')
 * @param {number} props.height - Map height (default: 300)
 * @param {boolean} props.showControls - Show zoom controls (default: true)
 * @param {boolean} props.retroStyle - Use retro 8-bit styling (default: false)
 * 
 * DEPENDENCIES:
 * npm install react-leaflet leaflet
 */

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
  boxShadow: $retro ? '4px 4px 0px rgba(0,0,0,0.2)' : theme.shadows[2],
  '& .leaflet-container': {
    height: '100%',
    width: '100%',
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
  '&:disabled': {
    backgroundColor: '#CCCCCC',
    borderColor: '#999999',
    color: '#666666',
  },
}));

const AddressOverlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$retro',
})(({ theme, $retro }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: $retro ? '#E0AC69' : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: $retro ? 'none' : 'blur(4px)',
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  borderTop: $retro ? '3px solid #2C2C2C' : '1px solid rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
}));

const PixelTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.6rem',
  lineHeight: 1.6,
}));

// Create custom red marker icon
const createLocationIcon = () => {
  return L.divIcon({
    className: 'custom-location-marker',
    html: `
      <div style="
        background-color: #EF4444;
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
      ">
        <span style="transform: rotate(45deg);">📍</span>
      </div>
    `,
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
  });
};

function MapView({ 
  latitude = 24.8091, 
  longitude = -107.3940, 
  address = '', 
  placeName = '',
  zoom = 15,
  width = '100%',
  height = 300,
  showControls = true,
  retroStyle = false
}) {
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const mapRef = useRef(null);

  // Validate coordinates
  const isValidCoordinates = 
    latitude != null && 
    longitude != null && 
    !isNaN(latitude) && 
    !isNaN(longitude) &&
    latitude >= -90 && 
    latitude <= 90 && 
    longitude >= -180 && 
    longitude <= 180;

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
    if (mapRef.current && isValidCoordinates) {
      mapRef.current.setView([latitude, longitude], currentZoom);
    }
  };

  if (!isValidCoordinates) {
    return (
      <Box
        sx={{
          width: width,
          height: height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
          border: '1px dashed #ccc',
          borderRadius: retroStyle ? 0 : 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No valid coordinates available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: width, height: height, position: 'relative' }}>
      <MapContainer_Styled $retro={retroStyle}>
        <MapContainer
          center={[latitude, longitude]}
          zoom={currentZoom}
          scrollWheelZoom={true}
          ref={mapRef}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker
            position={[latitude, longitude]}
            icon={createLocationIcon()}
          >
            {(placeName || address) && (
              <Popup>
                <Box sx={{ 
                  fontFamily: retroStyle ? "'Press Start 2P', cursive" : 'inherit',
                  fontSize: retroStyle ? '0.6rem' : '0.875rem',
                  lineHeight: 1.6,
                  textAlign: 'center',
                  minWidth: '150px'
                }}>
                  {placeName && (
                    <Typography sx={{ 
                      fontFamily: retroStyle ? "'Press Start 2P', cursive" : 'inherit',
                      fontSize: retroStyle ? '0.6rem' : '0.875rem',
                      fontWeight: 'bold',
                      mb: 0.5,
                      color: '#2C2C2C'
                    }}>
                      {placeName}
                    </Typography>
                  )}
                  {address && (
                    <Typography sx={{ 
                      fontFamily: retroStyle ? "'Press Start 2P', cursive" : 'inherit',
                      fontSize: retroStyle ? '0.5rem' : '0.75rem',
                      color: '#666'
                    }}>
                      {address}
                    </Typography>
                  )}
                </Box>
              </Popup>
            )}
          </Marker>
        </MapContainer>

        {/* Zoom controls */}
        {showControls && (
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
                <MyLocation fontSize="small" />
              </StyledIconButton>
            </Tooltip>
          </Box>
        )}

        {/* Address overlay */}
        {address && (
          <AddressOverlay $retro={retroStyle}>
            <LocationOn 
              sx={{ 
                color: '#EF4444', 
                fontSize: retroStyle ? 20 : 24 
              }} 
            />
            {retroStyle ? (
              <PixelTypography sx={{ flex: 1, color: '#2C2C2C' }}>
                {address}
              </PixelTypography>
            ) : (
              <Typography 
                variant="body2" 
                sx={{ 
                  flex: 1,
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              >
                {address}
              </Typography>
            )}
          </AddressOverlay>
        )}
      </MapContainer_Styled>
    </Box>
  );
}

export default MapView;
