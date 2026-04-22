import { useState, useEffect } from 'react';
import {
    Button,
    Typography,
    Box,
    CircularProgress,
    useMediaQuery,
    useTheme,
    Alert
} from '@mui/material';
import { Save } from '@mui/icons-material';
import ManageItinerary from './Itinerary/ManageItinerary';
import SnackbarNotification from '../Commons/SnackbarNotification';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import useTripMutationApi from '../../hooks/Trips/useTripMutationApi';
import useTripDetailsApi from '../../hooks/Trips/useTripDetailsApi';

function EditItinerary() {
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
    const { loading, user } = useAuth();
    const navigate = useNavigate();
    const { getTrip } = useTripMutationApi();
    const { saveItinerary } = useTripDetailsApi();
    
    const { id } = useParams();
    
    const [errors, setErrors] = useState({
        duplicatedplace: false,
        tripinfo: false,
        notMember: false
    });
    
    const [formTrip, setFormTrip] = useState({
        name: '',
        owner: { id: null, tag: '' },
        itinerary: [],
        members: []
    });

    const [originalTrip, setOriginalTrip] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [messageSnack, setMessageSnack] = useState('');

    // Check if user is member or owner
    const isMemberOrOwner = () => {
        if (!user || !formTrip) return false;
        
        // Check if user is owner
        if (formTrip.owner.id === parseInt(user)) return true;
        
        // Check if user is member
        return formTrip.members.some(member => member.user.id === parseInt(user));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isMemberOrOwner()) {
            setMessageSnack("You are not authorized to edit this itinerary.");
            return;
        }

        setIsSubmitting(true);
        setSubmitSuccess(false);

        try {
            if (
                originalTrip &&
                JSON.stringify(originalTrip.itinerary) !== JSON.stringify(formTrip.itinerary)
            ) {
                await saveTripItinerary();
                setMessageSnack("Itinerary was saved successfully.");
                setSubmitSuccess(true);
                
                setTimeout(() => {
                    navigate('/View/Trip/' + id);
                }, 2000);
            } else {
                setMessageSnack("No changes detected.");
            }
        } catch (error) {
            setMessageSnack(`Error updating itinerary: ${error.message}`);
            console.error('Error updating itinerary:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const saveTripItinerary = async () => {
        const lst = formTrip.itinerary.map(itinerary => ({
            "placeid": itinerary.place.id,
            "initialdate": itinerary.initialdate,
            "finaldate": itinerary.finaldate
        }));

        const rq = {
            "Itinerary": lst
        };

        try {
            await saveItinerary(id, rq, 'put');
        } catch (error) {
            console.error("Error saving itinerary", error);
            throw error;
        }
    };

    const handlePlaceAdd = (item) => {
        const foundInList = formTrip.itinerary.filter(x => x.place.id == item.place.id);
        
        if (foundInList.length == 0) {
            setFormTrip(
                prev => ({
                    ...prev,
                    itinerary: [...prev.itinerary, item]
                })
            );
        } else {
            setErrors(prev => ({
                ...prev,
                duplicatedplace: true
            }));
        }
    };

    const handleRemove = (event) => {
        const foundInList = formTrip.itinerary.filter(x => x.place.id == event);
        
        if (foundInList.length == 1) {
            const filteredList = formTrip.itinerary.filter(item => item.place.id !== event);
            setFormTrip(prev => ({ ...prev, itinerary: filteredList }));
        }
    };

    const handleDateUpdate = (placeId, initialdate, finaldate) => {
        setFormTrip(prev => ({
            ...prev,
            itinerary: prev.itinerary.map(item => 
                item.place.id === placeId 
                    ? { ...item, initialdate, finaldate }
                    : item
            )
        }));
    };

    const clearItinerary = () => {
        setFormTrip(
            prev => ({
                ...prev,
                itinerary: []
            })
        );
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSubmitSuccess(false);
    };

    useEffect(() => {
        const fetchTrip = async () => {
            if (!id) return;
            
            try {
                const response = await getTrip(id);
                const tripData = response.data.info;
                
                setFormTrip(tripData);
                setOriginalTrip(tripData);
                
                // Check if user is member or owner
                const userId = parseInt(user);
                const isOwner = tripData.owner.id === userId;
                const isMember = tripData.members.some(member => member.user.id === userId);
                
                if (!isOwner && !isMember) {
                    setErrors(prev => ({ ...prev, notMember: true }));
                }
            } catch (err) {
                console.error("Error getting trip info", err);
                setErrors(prev => ({
                    ...prev,
                    tripinfo: true
                }));
            }
        };
        
        if (user) {
            fetchTrip();
        }
    }, [id, user]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (errors.notMember) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert 
                    severity="error"
                    sx={{
                        borderRadius: 0,
                        border: '4px solid #2C2C2C',
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.7rem',
                        lineHeight: 1.6
                    }}
                >
                    You must be a member or owner of this trip to edit the itinerary.
                </Alert>
                <Button
                    onClick={() => navigate('/View/Trip/' + id)}
                    variant="text"
                    sx={{ mt: 2 }}
                >
                    Back to Trip
                </Button>
            </Box>
        );
    }

    if (errors.tripinfo) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error">
                    Error loading trip information.
                </Alert>
            </Box>
        );
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%'
            }}
        >
            <Typography 
                variant={isSmUp ? "h3" : "h4"} 
                align="center"
                sx={{
                    fontFamily: "'Press Start 2P', cursive",
                    color: '#2c3e50',
                    fontSize: isSmUp ? '1.5rem' : '1.2rem',
                    lineHeight: 1.6,
                    mb: 1
                }}
            >
                Edit Itinerary
            </Typography>

            <Typography 
                variant="body1" 
                align="center"
                sx={{
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    mb: 2,
                    color: '#555'
                }}
            >
                Trip: {formTrip.name}
            </Typography>

            <Alert 
                severity="info"
                sx={{
                    borderRadius: 0,
                    border: '2px solid #2C2C2C',
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.6rem',
                    lineHeight: 1.6,
                    mb: 2
                }}
            >
                As a member, you can add or remove places from the itinerary.
            </Alert>

            <ManageItinerary
                itinerary={formTrip.itinerary}
                onPlaceAdd={handlePlaceAdd}
                onPlaceRemove={handleRemove}
                onClearItinerary={clearItinerary}
                onDateUpdate={handleDateUpdate}
            />

            {errors.duplicatedplace && (
                <Alert 
                    severity="warning"
                    onClose={() => setErrors(prev => ({ ...prev, duplicatedplace: false }))}
                    sx={{
                        borderRadius: 0,
                        border: '2px solid #2C2C2C',
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.6rem'
                    }}
                >
                    This place is already in the itinerary.
                </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    variant="text"
                    startIcon={<Save/>}
                    sx={{ flex: 1 }}
                >
                    Save Changes
                </Button>

                <Button
                    onClick={() => navigate('/View/Trip/' + id)}
                    variant="outlined"
                    sx={{ flex: 1 }}
                >
                    Cancel
                </Button>
            </Box>

            <SnackbarNotification
                open={submitSuccess}
                onClose={handleSnackbarClose}
                message={messageSnack}
                severity="success"
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Box>
    );
}

export default EditItinerary;
