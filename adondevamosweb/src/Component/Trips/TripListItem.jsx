import { useState } from 'react';
import {
    Box,
    Typography,
    ListItem,
    ListItemText,
    IconButton,
    Chip,
    Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, ThumbUp, CalendarToday, LocationOn } from '@mui/icons-material';

const StyledListItem = styled(ListItem)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
    marginBottom: theme.spacing(2),
    backgroundColor: '#E0AC69',
    padding: theme.spacing(2),
    cursor: 'pointer',
    transition: 'transform 0.1s, box-shadow 0.1s',
    '&:hover': {
        transform: 'translate(-2px, -2px)',
        boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
        backgroundColor: '#E8B976',
    },
}));

const PixelTypography = styled(Typography)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
}));

function TripListItem({ trip, onView }) {
    // Extract trip data
    const tripName = trip?.name || 'Unnamed Trip';
    const description = trip?.description || '';
    const initialDate = trip?.initialdate ? new Date(trip.initialdate).toLocaleDateString() : '';
    const finalDate = trip?.finaldate ? new Date(trip.finaldate).toLocaleDateString() : '';
    const voteCount = trip?.statics?.Votes?.Total || 0;
    const locationCount = trip?.itinerary ? trip.itinerary.length : 0;

    const handleClick = () => {
        if (onView && trip?.id) {
            onView(trip.id);
        }
    };

    return (
        <StyledListItem onClick={handleClick}>
            <ListItemText
                primary={
                    <PixelTypography
                        variant="h6"
                        sx={{
                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                            color: '#2C2C2C',
                            mb: 1,
                            lineHeight: 1.4
                        }}
                    >
                        {tripName}
                    </PixelTypography>
                }
                secondary={
                    <Box>
                        {description && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#2C2C2C',
                                    fontSize: '0.85rem',
                                    mb: 1.5,
                                    lineHeight: 1.5,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {description}
                            </Typography>
                        )}
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                            {initialDate && finalDate && (
                                <Chip
                                    icon={<CalendarToday sx={{ fontSize: '0.9rem' }} />}
                                    label={`${initialDate} - ${finalDate}`}
                                    size="small"
                                    sx={{
                                        borderRadius: 0,
                                        border: '2px solid #2C2C2C',
                                        backgroundColor: '#FFFFFF',
                                        fontFamily: "'Press Start 2P', cursive",
                                        fontSize: '0.5rem',
                                        height: 'auto',
                                        padding: '4px 8px',
                                        '& .MuiChip-icon': {
                                            fontSize: '0.8rem',
                                        }
                                    }}
                                />
                            )}
                            {locationCount > 0 && (
                                <Chip
                                    icon={<LocationOn sx={{ fontSize: '0.9rem' }} />}
                                    label={`${locationCount} ${locationCount === 1 ? 'Place' : 'Places'}`}
                                    size="small"
                                    sx={{
                                        borderRadius: 0,
                                        border: '2px solid #2C2C2C',
                                        backgroundColor: '#52B788',
                                        color: '#FFFFFF',
                                        fontFamily: "'Press Start 2P', cursive",
                                        fontSize: '0.5rem',
                                        height: 'auto',
                                        padding: '4px 8px',
                                        '& .MuiChip-icon': {
                                            fontSize: '0.8rem',
                                            color: '#FFFFFF'
                                        }
                                    }}
                                />
                            )}
                            <Chip
                                icon={<ThumbUp sx={{ fontSize: '0.9rem' }} />}
                                label={`${voteCount} ${voteCount === 1 ? 'Vote' : 'Votes'}`}
                                size="small"
                                sx={{
                                    borderRadius: 0,
                                    border: '2px solid #2C2C2C',
                                    backgroundColor: '#E63946',
                                    color: '#FFFFFF',
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: '0.5rem',
                                    height: 'auto',
                                    padding: '4px 8px',
                                    '& .MuiChip-icon': {
                                        fontSize: '0.8rem',
                                        color: '#FFFFFF'
                                    }
                                }}
                            />
                        </Stack>
                    </Box>
                }
            />
            <IconButton
                edge="end"
                aria-label="view"
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                }}
                sx={{
                    color: '#3D5A80',
                    border: '3px solid #2C2C2C',
                    borderRadius: 0,
                    padding: '8px',
                    backgroundColor: '#FFFFFF',
                    '&:hover': {
                        backgroundColor: '#F0F0F0',
                    }
                }}
            >
                <Visibility />
            </IconButton>
        </StyledListItem>
    );
}

export default TripListItem;
