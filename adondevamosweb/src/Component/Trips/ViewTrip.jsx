import { useState, useEffect } from "react";
import 
    {
        CircularProgress,
        Typography,
        Box,
        IconButton,
        Badge,
        List,
        ListItem,
        ListItemText,
        Alert,
        Divider,
        Paper,
        Tooltip,
        Card,
        CardContent,
        CardMedia,
        Stack
    } from '@mui/material';
import { Visibility, Edit, FavoriteBorder, EditLocation, PersonAdd, AddLocation } from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useTripById from '../../hooks/Trips/useTripById';
import useVoteApi from '../../hooks/Votes/useVoteApi';
import { styled } from '@mui/material/styles';

import ViewMemberList from '../View/ViewMemberList'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import utils from "../../Resources/utils";
import ImageCarousel from "../Commons/ImageCarousel";
import Itinerary from "./Itinerary/Itinerary";
import ItineraryMap from "./ItineraryMap";
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

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    marginBottom: theme.spacing(3),
    overflow: 'visible',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#E0AC69',
    padding: theme.spacing(3),
    borderBottom: '4px solid #2C2C2C',
    '&:last-child': {
        paddingBottom: theme.spacing(3),
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

function ViewTrip(){
    //Get id
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLogged, user } = useAuth();
    const { voteTrip, getTripVotesSummary, voteItineraryPlace } = useVoteApi();
    const [liked, setLiked] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isVotingPlace, setIsVotingPlace] = useState(false); // Prevent multiple votes
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    const [placeHolderImageMX] = useState("/PlaceHolder_MX.jpg");
    const [placeHolderImageJP] = useState("/PlaceHolder_JP.jpg");
    const {
        tripInfo,
        setTripInfo,
        loading: loadingPage,
        error,
        notFound
    } = useTripById(id, {
        includeUserHeader: isLogged,
        userId: user
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (!tripInfo) {
            setLiked(false);
            setIsOwner(false);
            return;
        }

        setLiked(tripInfo.userVoted || false);
        setIsOwner(user && (tripInfo.owner.id === parseInt(user)));
    }, [tripInfo, user]);

    // Check if user is owner or member
    const isOwnerOrMember = () => {
        if (!user || !tripInfo) return false;
        
        // Check if user is owner
        if (tripInfo.owner.id === parseInt(user)) return true;
        
        // Check if user is in member list
        return tripInfo.members.some(member => member.user.id === parseInt(user));
    };

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleVoteTrip = async () => {
        if (!user) {
            showSnackbar('You must be logged in to vote.', 'warning');
            return;
        }

        try {
            await voteTrip(id, user);
            await updateVotes();
            setLiked(prevLiked => {
                const nextLiked = !prevLiked;
                showSnackbar(nextLiked ? 'Trip added to favorites' : 'Trip removed from favorites', 'success');
                return nextLiked;
            });
        } catch (error) {
            showSnackbar('Could not update vote. Please try again.', 'error');
            console.error("There was an error liking the trip!", error);
        }
    };

    const updateVotes = async () => {
        try {
            const votesTotal = await getTripVotesSummary(id);
            setTripInfo( prevTripInfo => ({
                ...prevTripInfo,
                statics: {
                    ...prevTripInfo.statics,
                    Votes: { Total: votesTotal }
                }
            }));
        } catch (error) {
            
        }
    };

    const handleEdit = () => {
        navigate(`/Edit/Trip/${id}`);
    };

    const handleEditItinerary = () => {
        navigate(`/Edit/Itinerary/${id}`);
    };

    const handleEditMembers = () => {
        navigate(`/Edit/Members/${id}`);
    };

    const handleAddPlace = () => {
        // Navigate to appropriate edit page based on user role
        if (isOwner) {
            navigate(`/Edit/Trip/${id}`);
        } else {
            navigate(`/Edit/Itinerary/${id}`);
        }
    };

    const goToViewProfile = (userId) => {
        if (!userId) return;
        navigate('/View/User/' + userId);
    };

    const handleShare = () => {
        const tripUrl = window.location.href;
        navigator.clipboard.writeText(tripUrl).then(() => { });
    };

    const getBannerImage = () => {
        if (tripInfo?.gallery && tripInfo.gallery.length > 0) {
            return tripInfo.gallery[0].completeurl;
        }
        if (tripInfo?.itinerary && tripInfo.itinerary.length > 0) {
            return tripInfo.itinerary[0].place.Country.acronym === "JP" 
                ? placeHolderImageJP 
                : placeHolderImageMX;
        }
        return placeHolderImageMX;
    };

    

    if (loadingPage) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (notFound) {
        return (
            <StyledContainer>
                <Alert 
                    severity="warning" 
                    sx={{ 
                        mt: 2,
                        borderRadius: 0,
                        border: '4px solid #2C2C2C',
                        boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
                        backgroundColor: '#FEF3C7',
                        color: '#2C2C2C',
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.7rem',
                        lineHeight: 1.6,
                        '& .MuiAlert-icon': {
                            fontSize: '1rem',
                            color: '#D97706'
                        }
                    }}
                >
                    Trip not found
                </Alert>
            </StyledContainer>
        );
    }
    
    if (error) {
        return (
            <StyledContainer>
                <Alert 
                    severity="error" 
                    sx={{ 
                        mt: 2,
                        borderRadius: 0,
                        border: '4px solid #2C2C2C',
                        boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
                        backgroundColor: '#FEE2E2',
                        color: '#2C2C2C',
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.7rem',
                        lineHeight: 1.6,
                        '& .MuiAlert-icon': {
                            fontSize: '1rem',
                            color: '#DC2626'
                        }
                    }}
                >
                    Error: {error}
                </Alert>
            </StyledContainer>
        );
    }
    
    if (!tripInfo) {
        return (
            <StyledContainer>
                <Alert 
                    severity="warning" 
                    sx={{ 
                        mt: 2,
                        borderRadius: 0,
                        border: '4px solid #2C2C2C',
                        boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
                        backgroundColor: '#FEF3C7',
                        color: '#2C2C2C',
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.7rem',
                        lineHeight: 1.6,
                        '& .MuiAlert-icon': {
                            fontSize: '1rem',
                            color: '#D97706'
                        }
                    }}
                >
                    Trip not found
                </Alert>
            </StyledContainer>
        );
    }
    return (
        <StyledContainer>
            
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
                        {tripInfo.name}
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
                        {tripInfo.description}
                    </PixelTypography>

                    <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        spacing={2} 
                        justifyContent="center"
                        alignItems="center"
                    >
                        <PixelTypography 
                            variant="body2" 
                            onClick={() => goToViewProfile(tripInfo.owner.id)}
                            sx={{ 
                                fontSize: { xs: '0.5rem', sm: '0.6rem' },
                                color: '#E8F4FD',
                                cursor: 'pointer',
                                '&:hover': {
                                    color: '#FFFFFF',
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            By: {tripInfo.owner.tag}
                        </PixelTypography>
                        <PixelTypography 
                            variant="body2" 
                            sx={{ 
                                fontSize: { xs: '0.5rem', sm: '0.6rem' },
                                color: '#E8F4FD'
                            }}
                        >
                            {utils.formatDate(tripInfo.initialdate)} - {utils.formatDate(tripInfo.finaldate)}
                        </PixelTypography>
                    </Stack>
                </StyledHeaderContent>
            </StyledHeaderCard>
            <StyledBanner
                component="img"
                image={getBannerImage()}
                alt="Trip banner"
            />

            {/* Members Section */}
            <StyledSectionCard>
                <StyledSectionHeader>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <PixelTypography 
                            variant="h5" 
                            sx={{ 
                                fontSize: { xs: '0.8rem', sm: '1rem' },
                                color: '#FFFFFF'
                            }}
                        >
                            Members
                        </PixelTypography>
                        {isOwnerOrMember() && (
                            <Tooltip title="Manage members">
                                <StyledActionButton
                                    onClick={handleEditMembers}
                                    size="small"
                                    sx={{ 
                                        padding: '6px',
                                        minWidth: 'auto',
                                        backgroundColor: '#FFFFFF',
                                        '&:hover': {
                                            backgroundColor: '#F8F8F8',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '2px 2px 0px #2C2C2C'
                                        }
                                    }}
                                >
                                    <PersonAdd sx={{ fontSize: '1rem' }} />
                                </StyledActionButton>
                            </Tooltip>
                        )}
                    </Box>
                </StyledSectionHeader>
                <StyledSectionContent>
                    {tripInfo.members.length !== 0 ? (
                        <ViewMemberList memberlist={tripInfo.members}/>
                    ) : (
                        <Alert 
                            severity="warning"
                            sx={{
                                borderRadius: 0,
                                border: '4px solid #2C2C2C',
                                boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
                                backgroundColor: '#FEF3C7',
                                color: '#2C2C2C',
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '0.6rem',
                                lineHeight: 1.6,
                                padding: '16px',
                                '& .MuiAlert-icon': {
                                    fontSize: '1rem',
                                    color: '#D97706'
                                },
                                '& .MuiAlert-message': {
                                    padding: 0,
                                    fontFamily: "'Press Start 2P', cursive"
                                }
                            }}
                        >
                            This trip has no member list yet.
                        </Alert>
                    )}
                </StyledSectionContent>
            </StyledSectionCard>
            {/* Itinerary Section */}
            <StyledSectionCard>
                <StyledSectionHeader>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <PixelTypography 
                            variant="h5" 
                            sx={{ 
                                fontSize: { xs: '0.8rem', sm: '1rem' },
                                color: '#FFFFFF'
                            }}
                        >
                            Itinerary
                        </PixelTypography>
                        {isOwnerOrMember() && (
                            <Tooltip title="Add place">
                                <StyledActionButton
                                    onClick={handleAddPlace}
                                    size="small"
                                    sx={{ 
                                        padding: '6px',
                                        minWidth: 'auto',
                                        backgroundColor: '#FFFFFF',
                                        '&:hover': {
                                            backgroundColor: '#F8F8F8',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '2px 2px 0px #2C2C2C'
                                        }
                                    }}
                                >
                                    <AddLocation sx={{ fontSize: '1rem' }} />
                                </StyledActionButton>
                            </Tooltip>
                        )}
                    </Box>
                </StyledSectionHeader>
                <StyledSectionContent>
                    <Itinerary 
                        tripinfo={tripInfo}
                        isOwnerOrMember={isOwnerOrMember()}
                        callBackView={(placeId) => {
                            if (!placeId) return;
                            navigate('/View/Place/' + placeId);
                        }}
                        callBackFavorite={isOwnerOrMember() ? async (placeId, tripId) => {
                            if (!user) {
                                showSnackbar('You must be logged in to vote.', 'warning');
                                return;
                            }
                            
                            if (isVotingPlace) {
                                return; // Prevent multiple simultaneous votes
                            }
                            
                            setIsVotingPlace(true);
                            
                            try {
                                await voteItineraryPlace(placeId, tripId, user);
                                showSnackbar('Vote updated successfully', 'success');
                            } catch (error) {
                                showSnackbar('Could not update vote. Please try again.', 'error');
                                console.error("There was an error voting for the place!", error);
                            } finally {
                                setIsVotingPlace(false);
                            }
                        } : null}
                    />
                </StyledSectionContent>
            </StyledSectionCard>
            
            {/* Itinerary Map */}
            <ItineraryMap itinerary={tripInfo?.itinerary || []} />
             
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
                    <ImageCarousel images={tripInfo.gallery} />
                </StyledSectionContent>
            </StyledSectionCard>
            {/* Actions Section */}
            <StyledActionsCard>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Tooltip title={liked ? "Unlike" : "Vote this trip"}>
                        <StyledActionButton
                            onClick={handleVoteTrip}
                            size="medium"
                        >
                            <Badge badgeContent={tripInfo.statics.Votes.Total} color="primary">
                                {liked ? <FavoriteIcon sx={{ color: '#ef4444' }} /> : <FavoriteBorder />}
                            </Badge>
                        </StyledActionButton>
                    </Tooltip>

                    <Tooltip title="Share trip">
                        <StyledActionButton
                            onClick={handleShare}
                            size="medium"
                        >
                            <ShareIcon />
                        </StyledActionButton>
                    </Tooltip>
                    
                    {isOwner && (
                        <Tooltip title="Edit trip">
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
                autoHideDuration={3000}
            />
        </StyledContainer>
    );
}

export default ViewTrip;