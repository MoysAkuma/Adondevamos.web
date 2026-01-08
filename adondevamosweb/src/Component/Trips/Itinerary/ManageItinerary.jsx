import { useState } from 'react';
import {
    Button,
    ButtonGroup,
    Alert,
    AlertTitle,
    Typography
} from '@mui/material';
import { Add, Delete, WatchLater } from '@mui/icons-material';
import SearchPlaces from '../SearchPlaces';
import Itinerary from './Itinerary';

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
        const foundInList = itinerary.filter(x => x.id === item.id);
        
        // If not found, add to itinerary
        if (foundInList.length === 0) {
            onPlaceAdd(item);
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
            
            {itinerary.length > 0 && (
                <Itinerary 
                    tripinfo={{ itinerary }} 
                    callBackDelete={handleRemove} 
                />
            )}
        </>
    );
}

export default ManageItinerary;
