import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import 
    {
        Typography,
        Box,
        CircularProgress,
        Alert,
        Stack,
        Tooltip,
        Divider,
        Paper,
        IconButton,
        Badge
    } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { FavoriteBorder, Edit } from '@mui/icons-material';
import FacilityIcon from "../Commons/FacilityIcon";
import { useAuth } from '../../context/AuthContext';
import MapView from "../Commons/MapView";
import ImageCarousel from "../Commons/ImageCarousel";
import usePlaceQueryApi from '../../hooks/Places/usePlaceQueryApi';
import useVoteApi from '../../hooks/Votes/useVoteApi';
import SnackbarNotification from '../Commons/SnackbarNotification';

function ViewPlace(){
    //Get id
    const { id } = useParams();
    const { isLogged, user, loading: authLoading, role, hasRole } = useAuth();
    const { getPlace } = usePlaceQueryApi();
    const { votePlace, getPlaceVotesSummary } = useVoteApi();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [placeInfo, setPlaceInfo] = useState(null);
    const [liked, setLiked] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleVotePlace = async () => {
        if (!user) {
            showSnackbar('You must be logged in to vote.', 'warning');
            return;
        }

        try {
            await votePlace(id, user);
            await updateVotes();
            setLiked(prevLiked => {
                const nextLiked = !prevLiked;
                showSnackbar(nextLiked ? 'Place added to favorites' : 'Place removed from favorites', 'success');
                return nextLiked;
            });
        } catch (error) {
            showSnackbar('Could not update vote. Please try again.', 'error');
            console.error("There was an error liking the trip!", error);
        }
    };

    const handleShare = () => {
        const placeUrl = window.location.href;
        navigator.clipboard.writeText(placeUrl).then(() => {
            // Optionally notify the user that the link has been copied
        });
    };

    const handleEdit = () => {
        navigate(`/Edit/Place/${id}`);
    };

    const updateVotes = async () => {
        try {
            const votesTotal = await getPlaceVotesSummary(id);
            setPlaceInfo( prevPlaceInfo => ({
                ...prevPlaceInfo,
                statics: {
                    ...prevPlaceInfo.statics,
                    Votes: { Total: votesTotal }
                }
            }));
            
        } catch (error) {
            console.error("There was an error fetching the votes!", error);
        }
    };
    
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPlace = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            
            setLoading(true);
            setError(null);
            
            try {
                const response = await getPlace(id, {
                    userId: isLogged ? user : null
                });
                setPlaceInfo(response.data.info);
                setLiked( response.data.info.userVote || false );
            } catch (err) {
                console.error("Error getting place info:", err);
                setError(err.response?.data?.message || 'Failed to fetch place');
            } finally {
                setLoading(false);
            }
        };
        fetchPlace();
        
    }, [id, user, isLogged, getPlace]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                Error: {error}
            </Alert>
        );
    }
    
    if (!placeInfo) {
        return (
            <Alert severity="warning" sx={{ mt: 2 }}>
                Place not found
            </Alert>
        );
    }
    
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%'
            }}
        >
            <Typography variant="h4" component="h4" align="center">
                {
                    placeInfo.name
                }
            </Typography>
            <Divider />
            {placeInfo.gallery && placeInfo.gallery.length > 0 && (
                <Box
                    component="img"
                    src={placeInfo.gallery[0].completeurl}
                    alt={placeInfo.name}
                    sx={{
                        width: '100%',
                        height: '250px',
                        maxHeight: '400px',
                        objectFit: 'cover',
                        borderRadius: 2,
                        mb: 2
                    }}
                />
            )}
            <Typography 
                variant="body1" 
                component="body1" 
                align="left">
                Description
            </Typography>
            
            <Typography 
                variant="b" 
                component="b" 
                align="right">
                {
                    placeInfo.description
                }
            </Typography>

            <Typography 
                variant="body1" 
                component="body1" 
                align="left">
                Address
            </Typography>
            <Typography 
                variant="b" 
                component="b" 
                align="right">
                {placeInfo.address}
            </Typography>
            <Typography gutterBottom variant="h6" component="div" align="left">
                Ubication
            </Typography>
            <MapView
                address={placeInfo.address}
                latitude={parseFloat(placeInfo.latitude)}
                longitude={parseFloat(placeInfo.longitude)}
                height={300}
                width="100%"
                zoom={15}
            />

            <Typography gutterBottom variant="body1" component="div" align="right">
                {placeInfo.City.name}, {placeInfo.State.name}, {placeInfo.Country.name}
            </Typography>

            
            <Typography 
                variant="h6" 
                component="div">
                Gallery
            </Typography>
            <ImageCarousel images={placeInfo.gallery} />
            <Divider />
            <Typography variant="h6" component="div" align="center">
                Facilities
            </Typography>
            <Divider />
            {
                placeInfo.facilities.length !== 0 ? 
                (
                    <Stack 
                        direction="row" 
                        spacing={2} 
                        flexWrap="wrap" 
                        useFlexGap 
                        alignSelf="center"
                        >
                        {
                            placeInfo.facilities.map((facility) => (
                                <Tooltip 
                                    title={facility.name} >
                                    <FacilityIcon 
                                        key={facility.code} 
                                        code={facility.code} 
                                        titleAccess={facility.name}
                                        color="white"
                                        fontSize="x-large"
                                    />
                            </Tooltip>
                        ))}
                    </Stack>
                ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        No facilities to show.
                    </Alert>
                )
            }
            <Divider />
            <Paper 
                elevation={2} 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    gap: 1
                }}
            >
                <Tooltip title={liked ? "Unlike" : "Vote this trip"}>
                    <IconButton 
                        color={liked ? "error" : "default"}
                        onClick={handleVotePlace}
                        size="medium"
                    >
                        <Badge badgeContent={placeInfo.statics.Votes.Total} color="primary">
                            {liked ? <FavoriteIcon /> : <FavoriteBorder />}
                        </Badge>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Share trip">
                    <IconButton 
                        color="default"
                        onClick={handleShare}
                        size="medium"
                    >
                        <ShareIcon />
                    </IconButton>
                </Tooltip>
                
                {
                hasRole('admin') && (
                    <Tooltip title="Edit trip">
                        <IconButton 
                            color="primary"
                            onClick={handleEdit}
                            size="medium"
                            
                        >
                            <Edit />
                        </IconButton>
                    </Tooltip>
                )}
            </Paper>
            <SnackbarNotification
                open={snackbar.open}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />

        </Box>
    );
}
export default ViewPlace;