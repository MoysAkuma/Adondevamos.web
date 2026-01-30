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
    Chip,
    Slider,
    Tooltip
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
        itinerary: [
                {
                    "initialdate": "2025-09-21",
                    "finaldate": "2025-09-21",
                    "place": {
                        "id": 10,
                        "name": "Playa gaviotas",
                        "Country": {
                            "id": 1,
                            "name": "Mexico",
                            "acronym": "MX"
                        },
                        "State": {
                            "id": 1,
                            "name": "Sinaloa"
                        },
                        "City": {
                            "id": 7,
                            "name": "Mazatlan"
                        }
                    }
                }
            ],
    },
    callBackView = function(item){}
})
{
    const [sliderValue, setSliderValue] = useState(0);
    const [showAllDates, setShowAllDates] = useState(true);

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
                
                <IconButton 
                    edge="end" 
                    aria-label="view" 
                    size="small"
                    onClick={() => callBackView(visit.place.id)}
                >
                    <Visibility />
                </IconButton>
            </Box>
        );
    }

    // Sort itinerary by initial date
    const sortedItinerary = tripinfo.itinerary ? [...tripinfo.itinerary].sort((a, b) => 
        new Date(a.initialdate) - new Date(b.initialdate)
    ) : [];

    // Get unique date ranges for slider marks
    const getSliderMarks = () => {
        if (!sortedItinerary.length) return [];
        
        return sortedItinerary.map((visit, index) => ({
            value: index,
            label: index === 0 || index === sortedItinerary.length - 1 
                ? formatDate(visit.initialdate) 
                : '',
            date: visit.initialdate,
            displayDate: generateDateText(visit.initialdate, visit.finaldate)
        }));
    };

    const sliderMarks = getSliderMarks();

    // Filter itinerary based on slider value
    const displayedItinerary = showAllDates || !sortedItinerary.length 
        ? sortedItinerary 
        : [sortedItinerary[sliderValue]];

    // Handle slider change
    const handleSliderChange = (event, newValue) => {
        setSliderValue(newValue);
        setShowAllDates(false);
    };

    // Reset to show all
    useEffect(() => {
        if (sortedItinerary.length > 0) {
            setShowAllDates(true);
            setSliderValue(0);
        }
    }, [tripinfo.itinerary]);

    // Custom tooltip component
    function ValueLabelComponent(props) {
        const { children, value } = props;
        const mark = sliderMarks[value];
        
        return (
            <Tooltip 
                enterTouchDelay={0} 
                placement="top" 
                title={mark?.displayDate || ''}
                arrow
            >
                {children}
            </Tooltip>
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
        <Box>
            {/* Date Slider - Only show if more than one itinerary item */}
            {sortedItinerary.length > 1 && (
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 3, 
                        mb: 2, 
                        borderRadius: 2,
                        bgcolor: 'grey.50'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Filter by Date
                        </Typography>
                        <Chip 
                            label={showAllDates ? "All Dates" : sliderMarks[sliderValue]?.displayDate}
                            size="small"
                            color="primary"
                            variant={showAllDates ? "outlined" : "filled"}
                        />
                        {!showAllDates && (
                            <Chip 
                                label="Show All"
                                size="small"
                                onClick={() => setShowAllDates(true)}
                                onDelete={() => setShowAllDates(true)}
                                sx={{ cursor: 'pointer' }}
                            />
                        )}
                    </Box>
                    <Slider
                        value={sliderValue}
                        onChange={handleSliderChange}
                        min={0}
                        max={sortedItinerary.length - 1}
                        step={1}
                        marks={sliderMarks}
                        valueLabelDisplay="auto"
                        slots={{
                            valueLabel: ValueLabelComponent
                        }}
                        sx={{
                            '& .MuiSlider-mark': {
                                backgroundColor: 'primary.main',
                                height: 8,
                                width: 8,
                                borderRadius: '50%',
                                '&.MuiSlider-markActive': {
                                    backgroundColor: 'primary.dark',
                                }
                            },
                            '& .MuiSlider-markLabel': {
                                fontSize: '0.75rem',
                                color: 'text.secondary'
                            }
                        }}
                    />
                </Paper>
            )}

            <Paper 
                elevation={1} 
                sx={{ 
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: 'background.paper'
                }}
            >
                <List sx={{ width: '100%', p: 0 }}>
                    {displayedItinerary.map((visit, index) => {
                        const days = calculateDays(visit.initialdate, visit.finaldate);
                        
                        return (
                            <Box key={visit.place.id}>
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
                                                    {visit.place.name}
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
                                
                                {index < displayedItinerary.length - 1 && <Divider />}
                            </Box>
                        );
                    })}
                </List>
            </Paper>
        </Box>
    );
}

export default Itinerary;
