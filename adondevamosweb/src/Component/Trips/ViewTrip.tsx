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
        Tooltip,
        Stack,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Button
    } from '@mui/material'; 
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useTripById from '../../hooks/Trips/useTripById';
import useVoteApi from '../../hooks/Votes/useVoteApi';

import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { Edit, FavoriteBorder, PersonAdd, 
    AddLocation, Close, Delete 
} from '@mui/icons-material'
import utils from "../../Resources/utils";
import ImageCarousel from "../Commons/ImageCarousel";
import Itinerary from "./Itinerary/Itinerary";
import ItineraryMap from "./ItineraryMap";
import SnackbarNotification from '../Commons/SnackbarNotification';
import SearchPlaces from './SearchPlaces';
import useTripDetailsApi from '../../hooks/Trips/useTripDetailsApi';
import ViewMemberList from '../View/ViewMemberList';
import {
    StyledContainer,
    StyledHeaderCard,
    StyledHeaderContent,
    StyledSectionCard,
    StyledSectionHeader,
    StyledSectionContent,
    StyledBanner,
    StyledActionsCard,
    StyledActionButton,
    PixelTypography,
    pageLoadingSx,
    warningAlertSx,
    errorAlertSx,
    tripTitleSx,
    tripDescriptionSx,
    tripOwnerSx,
    tripDatesSx,
    sectionHeaderRowSx,
    sectionTitleSx,
    compactActionButtonSx,
    iconSmallSx,
    emptyMembersAlertSx,
    actionsRowSx,
    likedIconSx,
    dialogTitleRowSx,
    dialogTitleSx,
    pendingPlacesTitleSx,
    pendingPlacesListSx,
} from '../../Css/Trips/trips.styles';

function ViewTrip(){
    //Get id
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLogged, user } = useAuth();
    const { voteTrip, getTripVotesSummary, voteItineraryPlace } = useVoteApi();
    const { saveItinerary } = useTripDetailsApi();
    const [liked, setLiked] = useState(false);
    const [isVotingPlace, setIsVotingPlace] = useState(false); // Prevent multiple votes
    const [addPlaceModalOpen, setAddPlaceModalOpen] = useState(false);
    const [pendingPlaces, setPendingPlaces] = useState([]);
    const [isSavingPlaces, setIsSavingPlaces] = useState(false);
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
            return;
        }

        setLiked(tripInfo.userVoted || false);
    }, [tripInfo, user]);

    const isOwner = Boolean(
        tripInfo?.owner?.id !== undefined &&
        user !== null &&
        Number(tripInfo.owner.id) === Number(user)
    );

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
        if (isOwner) {
            setPendingPlaces([]);
            setAddPlaceModalOpen(true);
            return;
        }

        navigate(`/Edit/Itinerary/${id}`);
    };

    const handleCloseAddPlaceModal = () => {
        if (isSavingPlaces) return;
        setAddPlaceModalOpen(false);
        setPendingPlaces([]);
    };

    const handleQueuedPlaceAdd = (place) => {
        const newItem = {
            place: {
                id: place.id,
                name: place.name,
                description: place.description
            },
            initialdate: place.initialdate,
            finaldate: place.finaldate
        };

        const duplicate = pendingPlaces.some(item =>
            item.place.id === newItem.place.id &&
            item.initialdate === newItem.initialdate &&
            item.finaldate === newItem.finaldate
        );

        if (duplicate) {
            showSnackbar('This exact place and date range is already queued.', 'warning');
            return;
        }

        setPendingPlaces(prev => [...prev, newItem]);
    };

    const handleRemoveQueuedPlace = (index) => {
        setPendingPlaces(prev => prev.filter((_, itemIndex) => itemIndex !== index));
    };

    const handleSaveQueuedPlaces = async () => {
        if (!isOwner) {
            showSnackbar('Only the trip owner can use quick add.', 'warning');
            return;
        }

        if (pendingPlaces.length === 0) {
            showSnackbar('Add at least one place before saving.', 'warning');
            return;
        }

        setIsSavingPlaces(true);

        try {
            const rq = {
                Itinerary: pendingPlaces.map(item => ({
                    placeid: item.place.id,
                    initialdate: item.initialdate,
                    finaldate: item.finaldate
                }))
            };

            await saveItinerary(id, rq, 'post');
            showSnackbar('Places added successfully.', 'success');
            setAddPlaceModalOpen(false);
            setPendingPlaces([]);
            window.location.reload();
        } catch (error) {
            showSnackbar('Could not add the selected places.', 'error');
            console.error('Error adding places to itinerary:', error);
        } finally {
            setIsSavingPlaces(false);
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
        if (tripInfo?.cover_url) {
            return tripInfo.cover_url;
        }

        if (tripInfo?.gallery && tripInfo.gallery.length > 0) {
            // First, try to find the cover image
            const coverImage = tripInfo.gallery.find(img => img.iscover);
            if (coverImage) {
                return coverImage.completeurl;
            }
            // If no cover is set, use the first image
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
            <Box sx={pageLoadingSx}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (notFound) {
        return (
            <StyledContainer>
                <Alert 
                    severity="warning" 
                    sx={warningAlertSx}
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
                    sx={errorAlertSx}
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
                    sx={warningAlertSx}
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
                        sx={tripTitleSx}
                    >
                        {tripInfo.name}
                    </PixelTypography>
                    
                    <PixelTypography 
                        variant="body1" 
                        sx={tripDescriptionSx}
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
                            sx={tripOwnerSx}
                        >
                            By: {tripInfo.owner.tag}
                        </PixelTypography>
                        <PixelTypography 
                            variant="body2" 
                            sx={tripDatesSx}
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
                    <Box sx={sectionHeaderRowSx}>
                        <PixelTypography 
                            variant="h5" 
                            sx={sectionTitleSx}
                        >
                            Members
                        </PixelTypography>
                        {isOwnerOrMember() && (
                            <Tooltip title="Manage members">
                                <StyledActionButton
                                    onClick={handleEditMembers}
                                    size="small"
                                    sx={compactActionButtonSx}
                                >
                                    <PersonAdd sx={iconSmallSx} />
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
                            sx={emptyMembersAlertSx}
                        >
                            This trip has no member list yet.
                        </Alert>
                    )}
                </StyledSectionContent>
            </StyledSectionCard>
            {/* Itinerary Section */}
            <StyledSectionCard>
                <StyledSectionHeader>
                    <Box sx={sectionHeaderRowSx}>
                        <PixelTypography 
                            variant="h5" 
                            sx={sectionTitleSx}
                        >
                            Itinerary
                        </PixelTypography>
                        {isOwner && (
                            <Tooltip title="Add place">
                                <StyledActionButton
                                    onClick={handleAddPlace}
                                    size="small"
                                    sx={compactActionButtonSx}
                                >
                                    <AddLocation sx={iconSmallSx} />
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
                        sx={sectionTitleSx}
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
                <Box sx={actionsRowSx}>
                    <Tooltip title={liked ? "Unlike" : "Vote this trip"}>
                        <StyledActionButton
                            onClick={handleVoteTrip}
                            size="medium"
                        >
                            <Badge badgeContent={tripInfo.statics.Votes.Total} color="primary">
                                {liked ? <FavoriteIcon sx={likedIconSx} /> : <FavoriteBorder />}
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

            <Dialog
                open={addPlaceModalOpen}
                onClose={handleCloseAddPlaceModal}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    <Box sx={dialogTitleRowSx}>
                        <Typography variant="h6" sx={dialogTitleSx}>
                            Add Place to Itinerary
                        </Typography>
                        <IconButton onClick={handleCloseAddPlaceModal} disabled={isSavingPlaces}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3}>
                        <Alert severity="info">
                            Search a place, select dates, and queue as many entries as you need before saving.
                        </Alert>

                        <SearchPlaces
                            callback={handleQueuedPlaceAdd}
                            itinerary={tripInfo?.itinerary || []}
                            allowRepeatedPlaces
                        />

                        <Box>
                            <Typography variant="subtitle1" sx={pendingPlacesTitleSx}>
                                Pending places ({pendingPlaces.length})
                            </Typography>

                            {pendingPlaces.length === 0 ? (
                                <Alert severity="warning">No places queued yet.</Alert>
                            ) : (
                                <List sx={pendingPlacesListSx}>
                                    {pendingPlaces.map((item, index) => (
                                        <ListItem
                                            key={`${item.place.id}-${item.initialdate}-${item.finaldate}-${index}`}
                                            secondaryAction={
                                                <IconButton edge="end" onClick={() => handleRemoveQueuedPlace(index)}>
                                                    <Delete />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText
                                                primary={item.place.name}
                                                secondary={`${utils.formatDate(item.initialdate)} - ${utils.formatDate(item.finaldate)}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddPlaceModal} disabled={isSavingPlaces}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveQueuedPlaces}
                        disabled={isSavingPlaces || pendingPlaces.length === 0}
                    >
                        Save Places
                    </Button>
                </DialogActions>
            </Dialog>
        </StyledContainer>
    );
}

export default ViewTrip;