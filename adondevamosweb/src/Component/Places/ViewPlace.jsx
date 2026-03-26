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
        Badge,
        Card,
        CardContent,
        CardMedia
    } from '@mui/material';
import { styled } from '@mui/material/styles';
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

// 8-bit Styled Components
const StyledContainer = styled(Box)(({ theme }) => ({
    maxWidth: '800px',
    margin: '0 auto',
    padding: theme.spacing(2),
}));

const StyledBanner = styled(CardMedia)(({ theme }) => ({
    height: 300,
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    marginBottom: theme.spacing(3),
    objectFit: 'cover',
    [theme.breakpoints.down('sm')]: {
        height: 200,
    },
}));

const StyledHeaderCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    marginBottom: theme.spacing(3),
    backgroundColor: '#3D5A80',
}));

const StyledHeaderContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#3D5A80',
    color: '#FFFFFF',
    padding: theme.spacing(3),
    textAlign: 'center',
}));

const StyledSectionCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    marginBottom: theme.spacing(3),
}));

const StyledSectionHeader = styled(Box)(({ theme }) => ({
    backgroundColor: '#52B788',
    padding: theme.spacing(2),
    borderBottom: '4px solid #2C2C2C',
}));

const StyledSectionContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#E0AC69',
    padding: theme.spacing(2),
    '&:last-child': {
        paddingBottom: theme.spacing(2),
    },
}));

const StyledActionsCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    backgroundColor: '#52B788',
    padding: theme.spacing(2),
}));

const StyledActionButton = styled(IconButton)(({ theme }) => ({
    color: '#2C2C2C',
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    border: '2px solid #2C2C2C',
    padding: theme.spacing(1.5),
    margin: theme.spacing(0, 1),
    '&:hover': {
        backgroundColor: '#F8F8F8',
        transform: 'translateY(-2px)',
        boxShadow: '3px 3px 0px #2C2C2C',
    },
}));

const PixelTypography = styled(Typography)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
}));

const StyledMapCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    overflow: 'hidden',
}));

const StyledFacilityCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    backgroundColor: '#E0AC69',
    padding: theme.spacing(2),
    textAlign: 'center',
}));

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
        <StyledContainer>
            {/* Banner Image */}
            {placeInfo.gallery && placeInfo.gallery.length > 0 && (
                <StyledBanner
                    component="img"
                    image={placeInfo.gallery[0].completeurl}
                    alt={placeInfo.name}
                />
            )}

            {/* Header Section */}
            <StyledHeaderCard>
                <StyledHeaderContent>
                    <PixelTypography 
                        variant="h3" 
                        component="h1" 
                        sx={{ 
                            fontSize: { xs: '1.2rem', sm: '1.8rem', md: '2.2rem' },
                            color: '#FFFFFF',
                            mb: 2,
                            lineHeight: 1.4
                        }}
                    >
                        {placeInfo.name}
                    </PixelTypography>
                    
                    <PixelTypography 
                        variant="body1" 
                        sx={{ 
                            fontSize: { xs: '0.6rem', sm: '0.8rem' },
                            color: '#E8F4FD',
                            mb: 2,
                            lineHeight: 1.6
                        }}
                    >
                        {placeInfo.description}
                    </PixelTypography>

                    <PixelTypography 
                        variant="body2" 
                        sx={{ 
                            fontSize: { xs: '0.5rem', sm: '0.6rem' },
                            color: '#E8F4FD'
                        }}
                    >
                        {placeInfo.City.name}, {placeInfo.State.name}, {placeInfo.Country.name}
                    </PixelTypography>
                </StyledHeaderContent>
            </StyledHeaderCard>

            {/* Address Section */}
            <StyledSectionCard>
                <StyledSectionHeader>
                    <PixelTypography 
                        variant="h5" 
                        sx={{ 
                            fontSize: { xs: '0.8rem', sm: '1rem' },
                            color: '#FFFFFF'
                        }}
                    >
                        Address
                    </PixelTypography>
                </StyledSectionHeader>
                <StyledSectionContent>
                    <PixelTypography 
                        variant="body2" 
                        sx={{ 
                            fontSize: { xs: '0.6rem', sm: '0.7rem' },
                            color: '#2C2C2C',
                            lineHeight: 1.6
                        }}
                    >
                        {placeInfo.address}
                    </PixelTypography>
                </StyledSectionContent>
            </StyledSectionCard>

            {/* Map Section */}
            <StyledSectionCard>
                <StyledSectionHeader>
                    <PixelTypography 
                        variant="h5" 
                        sx={{ 
                            fontSize: { xs: '0.8rem', sm: '1rem' },
                            color: '#FFFFFF'
                        }}
                    >
                        Location
                    </PixelTypography>
                </StyledSectionHeader>
                <StyledSectionContent>
                    <StyledMapCard>
                        <MapView
                            address={placeInfo.address}
                            latitude={parseFloat(placeInfo.latitude)}
                            longitude={parseFloat(placeInfo.longitude)}
                            height={300}
                            width="100%"
                            zoom={15}
                        />
                    </StyledMapCard>
                </StyledSectionContent>
            </StyledSectionCard>

            {/* Gallery Section */}
            <StyledSectionCard>
                <StyledSectionHeader>
                    <PixelTypography 
                        variant="h5" 
                        sx={{ 
                            fontSize: { xs: '0.8rem', sm: '1rem' },
                            color: '#FFFFFF'
                        }}
                    >
                        Gallery
                    </PixelTypography>
                </StyledSectionHeader>
                <StyledSectionContent>
                    <ImageCarousel images={placeInfo.gallery} />
                </StyledSectionContent>
            </StyledSectionCard>

            {/* Facilities Section */}
            <StyledSectionCard>
                <StyledSectionHeader>
                    <PixelTypography 
                        variant="h5" 
                        sx={{ 
                            fontSize: { xs: '0.8rem', sm: '1rem' },
                            color: '#FFFFFF'
                        }}
                    >
                        Facilities
                    </PixelTypography>
                </StyledSectionHeader>
                <StyledSectionContent>
                    {placeInfo.facilities.length !== 0 ? (
                        <Stack 
                            direction="row" 
                            spacing={2} 
                            flexWrap="wrap" 
                            useFlexGap 
                            justifyContent="center"
                        >
                            {placeInfo.facilities.map((facility) => (
                                <Tooltip 
                                    key={facility.code}
                                    title={facility.name}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: '#FFFFFF',
                                            border: '2px solid #2C2C2C',
                                            padding: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1,
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '3px 3px 0px #2C2C2C',
                                            },
                                            transition: 'all 0.2s ease-in-out',
                                        }}
                                    >
                                        <FacilityIcon 
                                            code={facility.code} 
                                            titleAccess={facility.name}
                                            color="#2C2C2C"
                                            fontSize="large"
                                        />
                                        <PixelTypography
                                            variant="caption"
                                            sx={{
                                                fontSize: '0.4rem',
                                                color: '#2C2C2C',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {facility.name}
                                        </PixelTypography>
                                    </Box>
                                </Tooltip>
                            ))}
                        </Stack>
                    ) : (
                        <Alert 
                            severity="info"
                            sx={{
                                borderRadius: 0,
                                border: '2px solid #2C2C2C',
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '0.6rem'
                            }}
                        >
                            No facilities to show.
                        </Alert>
                    )}
                </StyledSectionContent>
            </StyledSectionCard>

            {/* Actions Section */}
            <StyledActionsCard>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title={liked ? "Unlike" : "Vote this place"}>
                        <StyledActionButton
                            onClick={handleVotePlace}
                            size="medium"
                        >
                            <Badge badgeContent={placeInfo.statics.Votes.Total} color="primary">
                                {liked ? <FavoriteIcon sx={{ color: '#ef4444' }} /> : <FavoriteBorder />}
                            </Badge>
                        </StyledActionButton>
                    </Tooltip>

                    <Tooltip title="Share place">
                        <StyledActionButton
                            onClick={handleShare}
                            size="medium"
                        >
                            <ShareIcon />
                        </StyledActionButton>
                    </Tooltip>
                    
                    {hasRole('admin') && (
                        <Tooltip title="Edit place">
                            <StyledActionButton
                                onClick={handleEdit}
                                size="medium"
                            >
                                <Edit />
                            </StyledActionButton>
                        </Tooltip>
                    )}
                </Box>
            </StyledActionsCard>

            <SnackbarNotification
                open={snackbar.open}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </StyledContainer>
    );
}
export default ViewPlace;