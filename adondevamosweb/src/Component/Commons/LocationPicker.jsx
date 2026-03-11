import { Box, Typography, Paper, TextField, Button, Stack } from '@mui/material';
import { LocationOn, MyLocation } from '@mui/icons-material';
import { useState, useEffect } from 'react';

/**
 * LocationPicker - A reusable component to select a location on OpenStreetMap
 * @param {Object} props
 * @param {number} props.latitude - Initial latitude coordinate
 * @param {number} props.longitude - Initial longitude coordinate
 * @param {function} props.onChange - Callback when location changes (lat, lng)
 * @param {number} props.zoom - Map zoom level (default: 13)
 * @param {number} props.height - Map height (default: 400)
 */
function LocationPicker({ 
  latitude = 24.8091, 
  longitude = -107.3940, 
  onChange,
  zoom = 13,
  height = 400 
}) {
  const [lat, setLat] = useState(latitude);
  const [lng, setLng] = useState(longitude);
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    setLat(Number(latitude));
    setLng(Number(longitude));
  }, [latitude, longitude]);

  useEffect(() => {
    const parsedLat = Number(lat);
    const parsedLng = Number(lng);

    if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
      setMapUrl('');
      return;
    }

    // Generate OpenStreetMap embed URL with marker
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${parsedLng - 0.02},${parsedLat - 0.02},${parsedLng + 0.02},${parsedLat + 0.02}&layer=mapnik&marker=${parsedLat},${parsedLng}`;
    setMapUrl(url);
  }, [lat, lng]);

  const handleLatChange = (e) => {
    const newLat = parseFloat(e.target.value);
    if (!isNaN(newLat)) {
      setLat(newLat);
      if (onChange) {
        onChange(newLat, lng);
      }
    }
  };

  const handleLngChange = (e) => {
    const newLng = parseFloat(e.target.value);
    if (!isNaN(newLng)) {
      setLng(newLng);
      if (onChange) {
        onChange(lat, newLng);
      }
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;
          setLat(newLat);
          setLng(newLng);
          if (onChange) {
            onChange(newLat, newLng);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleOpenInOSM = () => {
    window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`, '_blank');
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        overflow: 'hidden',
        borderRadius: 2,
        p: 2
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOn color="error" />
          Select Location
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Latitude"
            type="number"
            value={lat}
            onChange={handleLatChange}
            inputProps={{ step: 0.000001 }}
            size="small"
            fullWidth
          />
          <TextField
            label="Longitude"
            type="number"
            value={lng}
            onChange={handleLngChange}
            inputProps={{ step: 0.000001 }}
            size="small"
            fullWidth
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button 
            variant="outlined" 
            startIcon={<MyLocation />}
            onClick={handleCurrentLocation}
            size="small"
          >
            Use My Location
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<LocationOn />}
            onClick={handleOpenInOSM}
            size="small"
          >
            Open in OpenStreetMap
          </Button>
        </Stack>

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: height,
            bgcolor: '#e0e0e0',
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={mapUrl || null}
            style={{ border: 0 }}
            title="Location Picker Map"
          />
        </Box>

        <Typography variant="caption" color="text.secondary">
          Enter coordinates manually or click "Use My Location" to get your current position. 
          Click "Open in OpenStreetMap" to select a precise location and copy coordinates.
        </Typography>
      </Stack>
    </Paper>
  );
}

export default LocationPicker;
