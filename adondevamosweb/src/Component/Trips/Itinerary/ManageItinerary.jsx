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
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    IconButton,
    Chip
} from '@mui/material';

import { LocationCity, Edit, CalendarMonth, Close } from '@mui/icons-material';
import { Add, Delete, WatchLater } from '@mui/icons-material';
import SearchPlaces from '../SearchPlaces';
import utils from '../../../Resources/utils';

function ManageItinerary({ 
    itinerary = [], 
    onPlaceAdd, 
    onPlaceRemove, 
    onClearItinerary,
    onDateUpdate
}) {
    const [showManager, setShowManager] = useState(false);
    const [duplicateError, setDuplicateError] = useState(false);
    const [dateModalOpen, setDateModalOpen] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [tempDates, setTempDates] = useState({ initialdate: '', finaldate: '' });

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

    const handleDateClick = (visit) => {
        setSelectedVisit(visit);
        setTempDates({
            initialdate: visit.initialdate || '',
            finaldate: visit.finaldate || ''
        });
        setDateModalOpen(true);
    };

    const handleDateModalClose = () => {
        setDateModalOpen(false);
        setSelectedVisit(null);
        setTempDates({ initialdate: '', finaldate: '' });
    };

    const handleDateChange = (field, value) => {
        setTempDates(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveDates = () => {
        if (selectedVisit && onDateUpdate) {
            onDateUpdate(selectedVisit.place.id, tempDates.initialdate, tempDates.finaldate);
        }
        handleDateModalClose();
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
                                        <Box 
                                            onClick={() => handleDateClick(visit)}
                                            sx={{ 
                                                mt: 0.5,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                cursor: 'pointer',
                                                padding: '4px 8px',
                                                borderRadius: 1,
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    bgcolor: 'action.hover',
                                                    color: 'primary.main'
                                                }
                                            }}
                                        >
                                            <CalendarMonth sx={{ fontSize: 16 }} />
                                            <Typography variant="body2" color="text.secondary" component="span">
                                                {utils.generateDateText(visit.initialdate, visit.finaldate)}
                                            </Typography>
                                            <Edit sx={{ fontSize: 14, ml: 0.5, opacity: 0.6 }} />
                                        </Box>
                                    }
                                    secondaryTypographyProps={{ component: 'div' }}
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
            {/* Date Edit Modal */}
            <Dialog 
                open={dateModalOpen} 
                onClose={handleDateModalClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarMonth color="primary" />
                            <Typography variant="h6">
                                Edit Dates - {selectedVisit?.place.name}
                            </Typography>
                        </Box>
                        <IconButton size="small" onClick={handleDateModalClose}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField
                            label="Start Date"
                            type="date"
                            value={tempDates.initialdate ? tempDates.initialdate.split('T')[0] : ''}
                            onChange={(e) => handleDateChange('initialdate', e.target.value)}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            helperText="When do you plan to arrive?"
                        />
                        <TextField
                            label="End Date"
                            type="date"
                            value={tempDates.finaldate ? tempDates.finaldate.split('T')[0] : ''}
                            onChange={(e) => handleDateChange('finaldate', e.target.value)}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            helperText="When do you plan to leave?"
                            inputProps={{
                                min: tempDates.initialdate ? tempDates.initialdate.split('T')[0] : undefined
                            }}
                        />
                        
                        {tempDates.initialdate && tempDates.finaldate && (
                            <Alert severity="info" icon={<CalendarMonth />}>
                                Duration: {utils.generateDateText(tempDates.initialdate, tempDates.finaldate)}
                            </Alert>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleDateModalClose} color="inherit">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSaveDates} 
                        variant="contained"
                        startIcon={<CalendarMonth />}
                    >
                        Save Dates
                    </Button>
                </DialogActions>
            </Dialog>        </>
    );
}

export default ManageItinerary;
