import { useState, useEffect } from "react";
import axios from 'axios';

import { 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    IconButton, 
    ListItemAvatar,
    Avatar,
    Paper,
    Divider,
    Box,
    Chip
} from '@mui/material';

import { 
    FlightLand, 
    FlightTakeoff, 
    Add, 
    Delete, 
    ArrowCircleUp, 
    ArrowCircleDown, 
    LocationCity, 
    Visibility
} from '@mui/icons-material';

function Itinerary ({
    tripinfo = {
        itinerary : [
        { 
            place : {
                id : 0,
                name : "Place Name",
                Country: {
                    id: 0,
                    name: "Country Name",
                    acronym: "CN"
                },
                State : {
                    id: 0,
                    name: "State Name"
                },
                City:{
                    id: 0,
                    name: "City Name"
                }
            },
            initialdate : "2024-03-23",
            finaldate : "2025-02-17"
        }
        ]
    },
    callBackView = function(item){}
})
{
    const formatDate = (dateString) => {
        if( !dateString ) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(date);
    };

    const callBackEdite = (e) => {
        
    };

    const generateDateText = (initialdate, finaldate) => {
      if( !initialdate || !finaldate ) return "Initial and final dates";
      if (initialdate == finaldate) return formatDate(initialdate);
      return formatDate(initialdate) + " → " + formatDate(finaldate);
    }

    const calculateDays = (initialdate, finaldate) => {
        if (!initialdate || !finaldate) return null;
        const start = new Date(initialdate);
        const end = new Date(finaldate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return days;
    }

    const generateOptions = ( visit, index) => {
        const isOwner = (tripinfo?.owner?.id == localStorage.getItem('userid'));
        if( !isOwner ) return null;
        
        return (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                {index != 0 && (
                    <IconButton 
                        edge="end" 
                        aria-label="move up" 
                        size="small"
                        color="primary"
                    >
                        <ArrowCircleUp />
                    </IconButton>
                )}

                {index != (tripinfo.itinerary.length - 1) && (
                    <IconButton 
                        edge="end" 
                        aria-label="move down" 
                        size="small"
                        color="primary"
                    >
                        <ArrowCircleDown />
                    </IconButton>
                )}
                
                <IconButton 
                    edge="end" 
                    aria-label="view" 
                    size="small"
                    onClick={() => callBackView(visit.id)}
                >
                    <Visibility />
                </IconButton>
            </Box>
        );
    }

    if (!tripinfo.itinerary || tripinfo.itinerary.length === 0) {
        return (
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 4, 
                    textAlign: 'center', 
                    bgcolor: 'grey.50',
                    borderRadius: 2
                }}
            >
                <Typography variant="body1" color="text.secondary">
                    No destinations added yet. Start planning your trip!
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper 
            elevation={1} 
            sx={{ 
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: 'background.paper'
            }}
        >
            <List sx={{ width: '100%', p: 0 }}>
                {tripinfo.itinerary.map((visit, index) => {
                    const days = calculateDays(visit.initialdate, visit.finaldate);
                    
                    return (
                        <Box key={visit.id}>
                            <ListItem
                                sx={{
                                    py: 2,
                                    px: 2,
                                    '&:hover': {
                                        bgcolor: 'action.hover'
                                    }
                                }}
                                secondaryAction={generateOptions(visit, index)}
                            >
                                <ListItemAvatar>
                                    <Avatar 
                                        sx={{ 
                                            bgcolor: 'primary.main',
                                            width: 48,
                                            height: 48
                                        }}
                                    >
                                        <LocationCity />
                                    </Avatar>
                                </ListItemAvatar>
                                
                                <ListItemText 
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {visit.name}
                                            </Typography>
                                            {days && (
                                                <Chip 
                                                    label={`${days} day${days > 1 ? 's' : ''}`} 
                                                    size="small" 
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {generateDateText(visit.initialdate, visit.finaldate)}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            
                            {index < tripinfo.itinerary.length - 1 && <Divider />}
                        </Box>
                    );
                })}
            </List>
        </Paper>
    );
}

export default Itinerary;