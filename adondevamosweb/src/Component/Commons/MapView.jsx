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

  useEffect(() => {
    // Generate static map URL using OpenStreetMap tiles
    // We'll use staticmap.openstreetmap.de or similar service
    // Alternative: Use OpenStreetMap tiles directly
    const centerLat = latitude;
    const centerLon = longitude;
    const z = zoom;
    
    // Using OpenStreetMap Static Map API
    // Note: For production, consider using a proper mapping library like Leaflet or react-leaflet
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${centerLon - 0.01},${centerLat - 0.01},${centerLon + 0.01},${centerLat + 0.01}&layer=mapnik&marker=${centerLat},${centerLon}`;
    
    setMapUrl(url);
  }, [latitude, longitude, zoom]);

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
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={mapUrl}
          style={{ border: 0 }}
          title="Location Map"
        />
        
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
