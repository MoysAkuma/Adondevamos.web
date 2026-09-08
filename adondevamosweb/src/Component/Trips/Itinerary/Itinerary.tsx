import { useState, useEffect } from "react";
import axios from 'axios';
import utils from "../../../Resources/utils";

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
    Slider,
    Tooltip,
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Collapse,
    Card,
    CardContent,
    Badge
} from '@mui/material';

import { 
    FlightLand, 
    FlightTakeoff, 
    Add, 
    Delete, 
    ArrowCircleUp, 
    ArrowCircleDown, 
    LocationCity, 
    Visibility,
    Favorite,
    FavoriteBorder,
    Edit,
    FilterList,
    ExpandMore,
    ExpandLess,
    Sort,
    AddLocation,
    Flag,
    CalendarToday,
    Public,
    Person
} from '@mui/icons-material';

import {
    ItineraryNoDataCard as StyledNoDataCard,
    ItineraryFilterButton as StyledFilterButton,
    ItineraryMainCard as StyledMainCard,
    ItineraryPixelTypography as PixelTypography,
    ItineraryFilterCard as StyledFilterCard,
    ItineraryFilterHeader as StyledFilterHeader,
    ItineraryFilterContent as StyledFilterContent,
    ItineraryListItem as StyledListItem,
    ItineraryAvatar as StyledAvatar,
    ItineraryActionButton as StyledActionButton,
    ItineraryPagination as StyledPagination,
} from '../../../Css/Trips/trips.styles';

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
    callBackView = null,
    callBackEdit = null,
    callBackFavorite = null,
    callBackAddPlace = null,
    isOwnerOrMember = false
}: any)
{
    const [sliderValue, setSliderValue] = useState(0);
    const [showAllDates, setShowAllDates] = useState(true);
    const [page, setPage] = useState(1);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [favoriteItems, setFavoriteItems] = useState(new Map()); // Changed to Map to store vote state from API
    const [voteCounts, setVoteCounts] = useState(new Map()); // Track total vote counts separately
    const [memberVoteCounts, setMemberVoteCounts] = useState(new Map()); // Track member vote counts separately
    const [filterVisible, setFilterVisible] = useState(false);
    const [showOnlyWithVotes, setShowOnlyWithVotes] = useState(false);
    const [sortByVotes, setSortByVotes] = useState(false);
    const itemsPerPage = 5;

    const callBackEdite = (e) => {
        
    };

    // Handle edit modal
    const handleEditOpen = (item) => {
        setEditingItem({
            ...item,
            initialdate: item.initialdate,
            finaldate: item.finaldate
        });
        setEditModalOpen(true);
    };

    const handleEditClose = () => {
        setEditModalOpen(false);
        setEditingItem(null);
    };

    const handleEditSave = () => {
        if (callBackEdit && editingItem) {
            callBackEdit(editingItem);
        }
        handleEditClose();
    };

    // Handle favorites
    const toggleFavorite = (placeId) => {
        const newFavorites = new Map(favoriteItems);
        const newVoteCounts = new Map(voteCounts);
        const newMemberVoteCounts = new Map(memberVoteCounts);
        
        const currentState = newFavorites.get(placeId) || false;
        const currentCount = newVoteCounts.get(placeId) || 0;
        const currentMemberCount = newMemberVoteCounts.get(placeId) || 0;
        
        // Toggle the favorite state
        const newState = !currentState;
        newFavorites.set(placeId, newState);
        
        // Update vote count: increment if adding favorite, decrement if removing
        const newCount = Math.max(0, currentCount + (newState ? 1 : -1));
        newVoteCounts.set(placeId, newCount);
        
        // Update member vote count if user is member/owner
        if (isOwnerOrMember) {
            const newMemberCount = Math.max(0, currentMemberCount + (newState ? 1 : -1));
            newMemberVoteCounts.set(placeId, newMemberCount);
        }
        
        setFavoriteItems(newFavorites);
        setVoteCounts(newVoteCounts);
        setMemberVoteCounts(newMemberVoteCounts);
        
        if (callBackFavorite) {
            callBackFavorite(placeId, tripinfo.id);
        }
    };

    // Handle pagination
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const generateDateText = (initialdate, finaldate) => {
      if( !initialdate || !finaldate ) return "Initial and final dates";
      if (initialdate == finaldate) return utils.formatDate(initialdate);
      return utils.formatDate(initialdate) + " → " + utils.formatDate(finaldate);
    }

    const generateShortDateText = (initialdate, finaldate) => {
        if (!initialdate || !finaldate) return 'Dates n/a';

        const shortFormatter = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric'
        });

        const start = shortFormatter.format(new Date(initialdate));
        const end = shortFormatter.format(new Date(finaldate));

        return initialdate === finaldate ? start : `${start} - ${end}`;
    };

    const calculateDays = (initialdate, finaldate) => {
        if (!initialdate || !finaldate) return null;
        const start = new Date(initialdate).getTime();
        const end = new Date(finaldate).getTime();
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return days;
    }

    const generateOptions = ( visit, index) => {
        const isOwner = (tripinfo?.owner?.id == localStorage.getItem('userid'));
        const isFavorite = favoriteItems.get(visit.place.id) || false;
        const currentVoteCount = voteCounts.get(visit.place.id) || 0;
        
        return (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                {/* Favorite Button - Only show if callback exists */}
                {callBackFavorite && (
                    <StyledActionButton 
                        edge="end" 
                        aria-label="favorite" 
                        size="small"
                        onClick={() => toggleFavorite(visit.place.id)}
                    >
                        {isFavorite ? <Favorite sx={{ color: '#E63946' }} /> : <FavoriteBorder />}
                    </StyledActionButton>
                )}
                
                {/* Edit Button - Only for owners and if callback exists */}
                {isOwner && callBackEdit && (
                    <StyledActionButton 
                        edge="end" 
                        aria-label="edit" 
                        size="small"
                        onClick={() => handleEditOpen(visit)}
                    >
                        <Edit />
                    </StyledActionButton>
                )}
            </Box>
        );
    }

    // Sort itinerary by date - primary: initial date, secondary: final date
    const sortedItinerary = tripinfo.itinerary ? [...tripinfo.itinerary].sort((a, b) => {
        // Parse initial dates
        const dateA = new Date(a.initialdate);
        const dateB = new Date(b.initialdate);
        
        // Primary sort by initial date
        const initialDateComparison = dateA.getTime() - dateB.getTime();
        
        // If initial dates are the same, sort by final date
        if (initialDateComparison === 0) {
            const finalDateA = new Date(a.finaldate);
            const finalDateB = new Date(b.finaldate);
            return finalDateA.getTime() - finalDateB.getTime();
        }
        
        return initialDateComparison;
    }) : [];

    // Group itinerary by date (initial date)
    const groupedByDate = sortedItinerary.reduce((acc, visit) => {
        const dateKey = visit.initialdate;
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(visit);
        return acc;
    }, {});

    // Get unique dates for slider marks
    const uniqueDates = Object.keys(groupedByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // Get unique date ranges for slider marks
    const getSliderMarks = () => {
        if (!uniqueDates.length) return [];
        
        return uniqueDates.map((date, index) => ({
            value: index,
            label: '', // No label to avoid overflow, use tooltip instead
            date: date,
            displayDate: utils.formatDate(date)
        }));
    };

    const sliderMarks = getSliderMarks();

    // Filter itinerary based on slider value
    const filteredItinerary = showAllDates || !sortedItinerary.length 
        ? sortedItinerary 
        : groupedByDate[uniqueDates[sliderValue]] || [];
    
    // Apply vote filter
    const voteFilteredItinerary = showOnlyWithVotes
        ? filteredItinerary.filter(visit => {
            const voteCount = voteCounts.get(visit.place.id) || 0;
            return voteCount > 0;
        })
        : filteredItinerary;
    
    // Apply sorting by votes if enabled
    const sortedByVotesItinerary = sortByVotes
        ? [...voteFilteredItinerary].sort((a, b) => {
            const votesA = voteCounts.get(a.place.id) || 0;
            const votesB = voteCounts.get(b.place.id) || 0;
            return votesB - votesA; // Descending order (most voted first)
        })
        : voteFilteredItinerary;
    
    // Apply pagination
    const totalPages = Math.ceil(sortedByVotesItinerary.length / itemsPerPage);
    const paginatedItinerary = sortedByVotesItinerary.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // Get top 3 most voted places
    const getTop3MostVoted = () => {
        // Create array of all places with their vote counts
        const placesWithVotes = sortedItinerary.map(visit => ({
            placeId: visit.place.id,
            votes: voteCounts.get(visit.place.id) || 0
        }));
        
        // Sort by votes (descending) and get unique places
        const sortedUniquePlaces = placesWithVotes
            .filter(item => item.votes > 0) // Only include places with votes
            .sort((a, b) => b.votes - a.votes)
            .reduce((acc, current) => {
                // Remove duplicates by placeId
                if (!acc.find(item => item.placeId === current.placeId)) {
                    acc.push(current);
                }
                return acc;
            }, [])
            .slice(0, 3); // Get top 3
        
        return {
            first: sortedUniquePlaces[0]?.placeId,
            second: sortedUniquePlaces[1]?.placeId,
            third: sortedUniquePlaces[2]?.placeId
        };
    };

    const top3 = getTop3MostVoted();

    // Get background color based on place ranking
    const getPlaceBackgroundColor = (placeId) => {
        if (placeId === top3.first) return '#FFD700'; // Gold
        if (placeId === top3.second) return '#C0C0C0'; // Silver
        if (placeId === top3.third) return '#CD7F32'; // Bronze
        return '#69bee0'; // Default blue
    };

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
            setPage(1);
        }
    }, [tripinfo.itinerary]);

    // Initialize favorite states and vote counts from API response
    useEffect(() => {
        if (tripinfo.itinerary) {
            const initialFavorites = new Map();
            const initialVoteCounts = new Map();
            const initialMemberVoteCounts = new Map();
            
            tripinfo.itinerary.forEach(item => {
                // Set favorite state (default to false if undefined)
                initialFavorites.set(item.place.id, item.userVoted || false);
                
                // Set vote count using new structure (default to 0 if undefined)
                const totalVoteCount = item.votes?.total_votes || 0;
                initialVoteCounts.set(item.place.id, totalVoteCount);
                
                // Set member vote count (only if user is owner/member)
                if (isOwnerOrMember) {
                    const memberVoteCount = item.votes?.members || 0;
                    initialMemberVoteCounts.set(item.place.id, memberVoteCount);
                }
            });
            
            setFavoriteItems(initialFavorites);
            setVoteCounts(initialVoteCounts);
            setMemberVoteCounts(initialMemberVoteCounts);
        }
    }, [tripinfo.itinerary, isOwnerOrMember]);

    // Update the max value for the slider based on unique dates
    const sliderMaxValue = Math.max(0, uniqueDates.length - 1);

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
            <StyledNoDataCard>
                <CardContent sx={{ padding: 4, textAlign: 'center' }}>
                    <PixelTypography 
                        variant="body1" 
                        sx={{ 
                            color: '#2C2C2C',
                            fontSize: { xs: '0.6rem', sm: '0.8rem' }
                        }}
                    >
                        No destinations added yet. Start planning your trip!
                    </PixelTypography>
                </CardContent>
            </StyledNoDataCard>
        );
    }

    return (
        <Box>
            {/* Add Place Button */}
            {isOwnerOrMember && callBackAddPlace && (
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <StyledFilterButton
                        startIcon={<AddLocation />}
                        onClick={callBackAddPlace}
                        sx={{ 
                            backgroundColor: '#52B788',
                            color: '#FFFFFF',
                            '&:hover': {
                                backgroundColor: '#3D5A80',
                            }
                        }}
                    >
                        Add Place
                    </StyledFilterButton>
                </Box>
            )}

            {sortedItinerary.length > 1 && (
                <Box sx={{ mb: 2 }}>
                    {/* Filter Toggle Button */}
                    <StyledFilterButton
                        startIcon={<FilterList />}
                        endIcon={filterVisible ? <ExpandLess /> : <ExpandMore />}
                        onClick={() => setFilterVisible(!filterVisible)}
                        sx={{ mb: filterVisible ? 2 : 0 }}
                    >
                        {filterVisible ? 'Hide Filters' : 'Show Filters'}
                    </StyledFilterButton>
                    
                    {/* Collapsible Filter */}
                    <Collapse in={filterVisible}>
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 2, 
                                borderRadius: 0,
                                border: '4px solid #2C2C2C',
                                bgcolor: '#E0AC69'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <PixelTypography variant="subtitle2" sx={{ color: '#2C2C2C', fontSize: '0.6rem' }}>
                                    Filters & Sorting
                                </PixelTypography>
                            </Box>

                            {/* Vote Filters */}
                            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<Favorite />}
                                    onClick={() => {
                                        setShowOnlyWithVotes(!showOnlyWithVotes);
                                        setPage(1);
                                    }}
                                >
                                    {showOnlyWithVotes ? "Only With Votes" : "Show All"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Sort />}
                                    onClick={() => {
                                        setSortByVotes(!sortByVotes);
                                        setPage(1);
                                    }}
                                >
                                    {sortByVotes ? "Sorted by Votes" : "Sort by Votes"}
                                </Button>
                            </Box>

                            {/* Date Filter Section */}
                            <Divider sx={{ mb: 2, borderColor: '#2C2C2C', borderWidth: 2 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <PixelTypography variant="subtitle2" sx={{ color: '#2C2C2C', fontSize: '0.6rem' }}>
                                    Filter by Date
                                </PixelTypography>
                                <Box
                                    component="span"
                                    sx={{
                                        fontSize: '0.55rem',
                                        fontWeight: 700,
                                        color: '#2C2C2C',
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid #2C2C2C',
                                        padding: '4px 8px',
                                    }}
                                >
                                    {showAllDates ? "All Dates" : sliderMarks[sliderValue]?.displayDate}
                                </Box>
                                {!showAllDates && (
                                    <Button size="small" onClick={() => setShowAllDates(true)}>
                                        Show All
                                    </Button>
                                )}
                            </Box>
                            <Box sx={{ px: 2, pt: 1, pb: 1 }}>
                                <Slider
                                    value={sliderValue}
                                    onChange={handleSliderChange}
                                    min={0}
                                    max={sliderMaxValue}
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
                                        }
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Collapse>
                </Box>
            )}

            <StyledMainCard>
                <List sx={{ width: '100%', p: 0 }}>
                    {paginatedItinerary.map((visit) => {
                        const days = calculateDays(visit.initialdate, visit.finaldate);
                        const totalVotes = voteCounts.get(visit.place.id) || 0;
                        const memberVotes = memberVoteCounts.get(visit.place.id) || 0;
                        const ownerId = tripinfo?.owner?.id;
                        const isTripOwner = ownerId != null && String(ownerId) === String(localStorage.getItem('userid'));

                        return (
                            <StyledListItem
                                key={visit.place.id}
                                sx={{
                                    py: 2,
                                    px: 2,
                                    backgroundColor: getPlaceBackgroundColor(visit.place.id),
                                    '&:hover': {
                                        backgroundColor: visit.place.id === top3.first ? '#E6C200' :
                                            visit.place.id === top3.second ? '#A8A8A8' :
                                            visit.place.id === top3.third ? '#B86F28' :
                                            '#D4956B',
                                    },
                                }}
                                secondaryAction={
                                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                        {callBackFavorite && (
                                            <StyledActionButton
                                                aria-label="favorite"
                                                size="small"
                                                onClick={() => toggleFavorite(visit.place.id)}
                                                sx={{
                                                    ...((favoriteItems.get(visit.place.id) === true) && {
                                                        backgroundColor: '#E63946',
                                                        color: '#FFFFFF',
                                                        '&:hover': {
                                                            backgroundColor: '#C53030',
                                                        },
                                                    })
                                                }}
                                            >
                                                {favoriteItems.get(visit.place.id) === true ? (
                                                    <Favorite sx={{ color: '#FFFFFF' }} />
                                                ) : (
                                                    <FavoriteBorder sx={{ color: '#2C2C2C' }} />
                                                )}
                                            </StyledActionButton>
                                        )}

                                        {isTripOwner && callBackEdit && (
                                            <StyledActionButton
                                                aria-label="edit"
                                                size="small"
                                                onClick={() => handleEditOpen(visit)}
                                            >
                                                <Edit />
                                            </StyledActionButton>
                                        )}
                                    </Box>
                                }
                            >
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {(visit.place.id === top3.first || visit.place.id === top3.second || visit.place.id === top3.third) && (
                                                    <Box sx={{
                                                        fontSize: '1.4rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        flexShrink: 0
                                                    }}>
                                                        {visit.place.id === top3.first && '🥇'}
                                                        {visit.place.id === top3.second && '🥈'}
                                                        {visit.place.id === top3.third && '🥉'}
                                                    </Box>
                                                )}

                                                <PixelTypography
                                                    variant="body1"
                                                    sx={{
                                                        fontFamily: "'Roboto Slab', 'Georgia', serif",
                                                        fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.2rem' },
                                                        color: '#2C2C2C',
                                                        fontWeight: 'bold',
                                                        cursor: callBackView ? 'pointer' : 'default',
                                                        flex: 1,
                                                        lineHeight: 1.2,
                                                        wordBreak: 'break-word',
                                                        ...(callBackView && {
                                                            '&:hover': {
                                                                color: '#3D5A80',
                                                                textDecoration: 'underline'
                                                            }
                                                        }),
                                                        transition: 'all 0.2s ease-in-out'
                                                    }}
                                                    {...(callBackView && {
                                                        onClick: () => callBackView(visit.place.id)
                                                    })}
                                                >
                                                    {visit.place.name}
                                                </PixelTypography>
                                            </Box>

                                            <Box sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                alignItems: 'center',
                                                gap: 1,
                                                color: '#2C2C2C',
                                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                padding: '6px 10px',
                                                borderRadius: '3px',
                                                border: '1px solid rgba(44, 44, 44, 0.3)',
                                                fontSize: '0.72rem',
                                                fontWeight: 700,
                                            }}>
                                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Flag sx={{ fontSize: '0.85rem' }} />
                                                    <span>{visit.place.Country.acronym}</span>
                                                </Box>
                                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                                                    <CalendarToday sx={{ fontSize: '0.85rem' }} />
                                                    <span>{generateShortDateText(visit.initialdate, visit.finaldate)}</span>
                                                </Box>
                                                <Tooltip title="Votes from site" arrow>
                                                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Public sx={{ fontSize: '0.85rem' }} />
                                                        <span>{totalVotes}</span>
                                                    </Box>
                                                </Tooltip>
                                                <Tooltip title="Votes by members of this trip" arrow>
                                                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Person sx={{ fontSize: '0.85rem' }} />
                                                        <span>{memberVotes}</span>
                                                    </Box>
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                    }
                                    primaryTypographyProps={{ component: 'div' }}
                                />
                            </StyledListItem>
                        );
                    })}
                </List>
            </StyledMainCard>
            
            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <StyledPagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}

            {/* Edit Modal */}
            <Dialog
                open={editModalOpen}
                onClose={handleEditClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Edit Itinerary Item</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Place Name"
                            value={editingItem?.place?.name || ''}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Initial Date"
                            type="date"
                            value={editingItem?.initialdate || ''}
                            onChange={(e) => setEditingItem({
                                ...editingItem,
                                initialdate: e.target.value
                            })}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Final Date"
                            type="date"
                            value={editingItem?.finaldate || ''}
                            onChange={(e) => setEditingItem({
                                ...editingItem,
                                finaldate: e.target.value
                            })}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button onClick={handleEditSave} variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Itinerary;
