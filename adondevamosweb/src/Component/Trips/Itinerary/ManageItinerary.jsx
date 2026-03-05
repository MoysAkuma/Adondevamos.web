import { useState } from 'react';
import {
    Button,
    ButtonGroup,
    Alert,
    AlertTitle,
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider
} from '@mui/material';

import { LocationCity } from '@mui/icons-material';
import { Add, Delete, WatchLater } from '@mui/icons-material';
import SearchPlaces from '../SearchPlaces';
import utils from '../../../Resources/utils';

function ManageItinerary({ 
    itinerary = [], 
    onPlaceAdd, 
    onPlaceRemove, 
    onClearItinerary 
}) {
    const [showManager, setShowManager] = useState(false);
    const [duplicateError, setDuplicateError] = useState(false);

    const handlePlaceAdd = (item) => {
        // Search if exists in itinerary
        const foundInList = itinerary.filter(x => x.place.id === item.id);
        // If not found, add to itinerary
        if (foundInList.length === 0) {
            onPlaceAdd({
                place: {
                    name: item.name,
                    id: item.id
                },
                initialdate: item.initialdate || "",
                finaldate: item.finaldate || ""
                }
            );
            
            setShowManager(false);
            setDuplicateError(false);
        } else {
            setDuplicateError(true);
        }
    };

    const handleRemove = (id) => {
        onPlaceRemove(id);
    };

    const handleClear = () => {
        if (onClearItinerary) {
            onClearItinerary();
        }
    };

    const showSearch = () => {
        setShowManager(true);
        setDuplicateError(false);
    };


    const generateItineratyList = (itinerary) => {
           return( <Paper 
                elevation={1} 
                sx={{ 
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: 'background.paper'
                }}
            >
            <List sx={{ width: '100%', p: 0 }}>
                {itinerary.map((visit, index) => {
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
                                secondaryAction={<>
                                    <Button 
                                        variant="text" 
                                        color="error"
                                        onClick={() => handleRemove(visit.place.id)}
                                    >
                                        Remove
                                    </Button>
                                </>}
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
                                            
                                        </Box>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {utils.generateDateText(visit.initialdate, visit.finaldate)}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            
                            {index < itinerary.length - 1 && <Divider />}
                        </Box>
                    );
                })}
            </List>
        </Paper>)
    };

    return (
        <>
            <Typography variant="body1" align="left">
                Itinerary
            </Typography>
            
            <ButtonGroup 
                variant="contained" 
                color="primary" 
                fullWidth
            >
                <Button 
                    variant="contained" 
                    startIcon={<Add />}
                    onClick={showSearch}
                    disabled={showManager}
                >
                    Add place
                </Button>
                {itinerary.length === 0 ? (
                    <Button 
                        variant="text" 
                        endIcon={<WatchLater />}
                        onClick={(e) => e.preventDefault()}
                    >
                        Decided Later
                    </Button>
                ) : (
                    <Button 
                        variant="text" 
                        onClick={handleClear}
                        endIcon={<Delete />}
                    >
                        Reset itinerary
                    </Button>
                )}
            </ButtonGroup>
            
            {itinerary.length === 0 && (
                <Alert severity="info">
                    Your itinerary is empty
                </Alert>
            )}
            
            {showManager && (
                <SearchPlaces 
                    callback={handlePlaceAdd} 
                    itinerary={itinerary} 
                />
            )}
            
            {duplicateError && (
                <Alert severity="warning">
                    <AlertTitle>This place was already added</AlertTitle>
                    Please, select another place
                </Alert>
            )}
            
            {
            itinerary.length > 0 && (
                generateItineratyList(itinerary)
            )}
        </>
    );
}

export default ManageItinerary;
