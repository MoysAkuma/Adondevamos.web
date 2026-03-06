import { Box, Typography, Paper } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { useState, useEffect } from 'react';

/**
 * MapView - A reusable component to display a location on OpenStreetMap
 * @param {Object} props
 * @param {number} props.latitude - Latitude coordinate
 * @param {number} props.longitude - Longitude coordinate
 * @param {string} props.address - Address to display
 * @param {number} props.zoom - Map zoom level (default: 15)
 * @param {number} props.width - Map width (default: '100%')
 * @param {number} props.height - Map height (default: 300)
 */
function MapView({ 
  latitude = 24.8091, 
  longitude = -107.3940, 
  address = '', 
  zoom = 15,
  width = '100%',
  height = 300 
}) {
  const [mapUrl, setMapUrl] = useState('');
  const [currentZoom, setCurrentZoom] = useState(zoom);

  useEffect(() => {
    setCurrentZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    if (!latitude || !longitude) {
      setMapUrl('');
      return;
    }

    // Static visual map using OSM embed; user interaction disabled via pointer-events.
    const safeZoom = Math.max(3, Math.min(19, currentZoom));
    const halfSpan = 0.01 * Math.pow(2, 15 - safeZoom);
    const minLon = longitude - halfSpan;
    const minLat = latitude - halfSpan;
    const maxLon = longitude + halfSpan;
    const maxLat = latitude + halfSpan;
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${minLon},${minLat},${maxLon},${maxLat}&layer=mapnik`;

    setMapUrl(url);
  }, [latitude, longitude, currentZoom]);

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        overflow: 'hidden',
        borderRadius: 2,
        width: width
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: height,
          bgcolor: '#e0e0e0'
        }}
      >
        {/* OpenStreetMap iframe */}
        <Box
          component="iframe"
          src={mapUrl || null}
          title="Location Map"
          sx={{
            width: '100%',
            height: '100%',
            border: 0,
            pointerEvents: 'none'
          }}
        />

        {/* Fixed center marker */}
        <LocationOn
          color="error"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -100%)',
            fontSize: 40,
            zIndex: 2,
            filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))'
          }}
        />

        {/* Zoom controls */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            borderRadius: 1,
            overflow: 'hidden',
            bgcolor: 'background.paper'
          }}
        >
          <Box
            component="button"
            type="button"
            onClick={() => setCurrentZoom((prev) => Math.min(prev + 1, 19))}
            sx={{
              width: 34,
              height: 34,
              border: 0,
              bgcolor: 'background.paper',
              cursor: 'pointer',
              fontSize: 22,
              lineHeight: 1
            }}
          >
            +
          </Box>
          <Box
            component="button"
            type="button"
            onClick={() => setCurrentZoom((prev) => Math.max(prev - 1, 3))}
            sx={{
              width: 34,
              height: 34,
              border: 0,
              borderTop: '1px solid rgba(0, 0, 0, 0.2)',
              bgcolor: 'background.paper',
              cursor: 'pointer',
              fontSize: 22,
              lineHeight: 1
            }}
          >
            -
          </Box>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 3,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            border: '1px solid rgba(0, 0, 0, 0.1)',
            fontSize: 12,
            fontWeight: 600,
            color: 'text.secondary'
          }}
        >
          Zoom: {currentZoom}
        </Box>
        
        {/* Address overlay */}
        {address && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              borderTop: '1px solid rgba(0, 0, 0, 0.1)'
            }}
          >
            <LocationOn color="error" sx={{ fontSize: 24 }} />
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
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default MapView;
