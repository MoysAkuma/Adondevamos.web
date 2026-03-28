import { useState, useEffect } from "react";
import axios from 'axios';
import utils from "../../../Resources/utils";
import { styled } from '@mui/material/styles';

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
    AddLocation
} from '@mui/icons-material';

// 8-bit Styled Components
const StyledNoDataCard = styled(Paper)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    backgroundColor: '#E0AC69',
    padding: theme.spacing(4),
    textAlign: 'center',
}));

const StyledFilterButton = styled(Button)(({ theme }) => ({
    borderRadius: 0,
    border: '2px solid #2C2C2C',
    backgroundColor: '#FFFFFF',
    color: '#2C2C2C',
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.6rem',
    padding: theme.spacing(1, 2),
    '&:hover': {
        backgroundColor: '#F8F8F8',
        transform: 'translateY(-2px)',
    },
    transition: 'all 0.2s ease-in-out',
}));

const StyledMainCard = styled(Paper)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    backgroundColor: '#E0AC69',
    overflow: 'hidden',
}));

const PixelTypography = styled(Typography)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
}));

const StyledFilterCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    marginBottom: theme.spacing(2),
    overflow: 'visible',
}));

const StyledFilterHeader = styled(Box)(({ theme }) => ({
    backgroundColor: '#52B788',
    padding: theme.spacing(1),
    borderBottom: '4px solid #2C2C2C',
}));

const StyledFilterContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#E0AC69',
    padding: theme.spacing(2),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    backgroundColor: '#69bee0',
    borderBottom: '2px solid #2C2C2C',
    '&:hover': {
        backgroundColor: '#D4956B',
        transform: 'translateX(2px)',
    },
    transition: 'all 0.2s ease-in-out',
    '&:last-child': {
        borderBottom: 'none',
    },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    backgroundColor: '#3D5A80',
    border: '2px solid #2C2C2C',
    borderRadius: 0,
    width: 48,
    height: 48,
}));

const StyledActionButton = styled(IconButton)(({ theme }) => ({
    color: '#2C2C2C',
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    border: '2px solid #2C2C2C',
    padding: theme.spacing(1),
    margin: theme.spacing(0, 0.25),
    '&:hover': {
        backgroundColor: '#F8F8F8',
        transform: 'translateY(-2px)',
    },
    transition: 'all 0.2s ease-in-out',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
    backgroundColor: '#FFFFFF',
    color: '#2C2C2C',
    borderRadius: 0,
    border: '2px solid #2C2C2C',
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.5rem',
    '&:hover': {
        backgroundColor: '#E63946',
        color: '#FFFFFF',
        transform: 'scale(1.05)',
    },
    transition: 'all 0.2s ease-in-out',
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
    '& .MuiPaginationItem-root': {
        borderRadius: 0,
        border: '2px solid #2C2C2C',
        backgroundColor: '#FFFFFF',
        color: '#2C2C2C',
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '0.6rem',
        margin: theme.spacing(0, 0.25),
        '&:hover': {
            backgroundColor: '#F8F8F8',
            transform: 'translateY(-2px)',
        },
        '&.Mui-selected': {
            backgroundColor: '#3D5A80',
            color: '#FFFFFF',
        },
    },
}));

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
})
{
    const [sliderValue, setSliderValue] = useState(0);
    const [showAllDates, setShowAllDates] = useState(true);
    const [page, setPage] = useState(1);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [favoriteItems, setFavoriteItems] = useState(new Map()); // Changed to Map to store vote state from API
    const [voteCounts, setVoteCounts] = useState(new Map()); // Track vote counts separately
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
        
        const currentState = newFavorites.get(placeId) || false;
        const currentCount = newVoteCounts.get(placeId) || 0;
        
        // Toggle the favorite state
        const newState = !currentState;
        newFavorites.set(placeId, newState);
        
        // Update vote count: increment if adding favorite, decrement if removing
        const newCount = Math.max(0, currentCount + (newState ? 1 : -1));
        newVoteCounts.set(placeId, newCount);
        
        setFavoriteItems(newFavorites);
        setVoteCounts(newVoteCounts);
        
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

    const calculateDays = (initialdate, finaldate) => {
        if (!initialdate || !finaldate) return null;
        const start = new Date(initialdate);
        const end = new Date(finaldate);
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

    // Sort itinerary by initial date
    const sortedItinerary = tripinfo.itinerary ? [...tripinfo.itinerary].sort((a, b) => 
        new Date(a.initialdate) - new Date(b.initialdate)
    ) : [];

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
    const uniqueDates = Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b));

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
            
            tripinfo.itinerary.forEach(item => {
                // Set favorite state (default to false if undefined)
                initialFavorites.set(item.place.id, item.userVoted || false);
                
                // Set vote count (default to 0 if undefined)
                const voteCount = item.votes?.total || 0;
                initialVoteCounts.set(item.place.id, voteCount);
            });
            
            setFavoriteItems(initialFavorites);
            setVoteCounts(initialVoteCounts);
        }
    }, [tripinfo.itinerary]);

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
                                <StyledChip
                                    icon={<Favorite />}
                                    label={showOnlyWithVotes ? "Only With Votes" : "Show All"}
                                    onClick={() => {
                                        setShowOnlyWithVotes(!showOnlyWithVotes);
                                        setPage(1);
                                    }}
                                    sx={{
                                        ...(showOnlyWithVotes && {
                                            backgroundColor: '#E63946',
                                            color: '#FFFFFF',
                                            '&:hover': {
                                                backgroundColor: '#C53030',
                                            }
                                        })
                                    }}
                                />
                                <StyledChip
                                    icon={<Sort />}
                                    label={sortByVotes ? "Sorted by Votes" : "Sort by Votes"}
                                    onClick={() => {
                                        setSortByVotes(!sortByVotes);
                                        setPage(1);
                                    }}
                                    sx={{
                                        ...(sortByVotes && {
                                            backgroundColor: '#3D5A80',
                                            color: '#FFFFFF',
                                            '&:hover': {
                                                backgroundColor: '#2C4560',
                                            }
                                        })
                                    }}
                                />
                            </Box>

                            {/* Date Filter Section */}
                            <Divider sx={{ mb: 2, borderColor: '#2C2C2C', borderWidth: 2 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <PixelTypography variant="subtitle2" sx={{ color: '#2C2C2C', fontSize: '0.6rem' }}>
                                    Filter by Date
                                </PixelTypography>
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
                    {paginatedItinerary.map((visit, index) => {
                        const days = calculateDays(visit.initialdate, visit.finaldate);
                        
                        return (
                            <StyledListItem
                                key={visit.place.id}
                                sx={{
                                    py: 2,
                                    px: 2,
                                }}
                                secondaryAction={
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        {/* Favorite Button - Only show if callback exists */}
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
                                                <Badge 
                                                    badgeContent={voteCounts.get(visit.place.id) || 0} 
                                                    color="error"
                                                    sx={{
                                                        '& .MuiBadge-badge': {
                                                            fontSize: '0.6rem',
                                                            minWidth: '18px',
                                                            height: '18px',
                                                            padding: '0 4px',
                                                            fontFamily: '"Press Start 2P", cursive'
                                                        }
                                                    }}
                                                >
                                                    {(favoriteItems.get(visit.place.id) === true) ? 
                                                        <Favorite sx={{ color: '#FFFFFF' }} /> : 
                                                        <FavoriteBorder sx={{ color: '#2C2C2C' }} />
                                                    }
                                                </Badge>
                                            </StyledActionButton>
                                        )}
                                        
                                        {/* Edit Button - Only for owners and if callback exists */}
                                        {((tripinfo?.owner?.id == localStorage.getItem('userid'))) && callBackEdit && (
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
                                <ListItemAvatar>
                                    <StyledAvatar
                                        sx={{
                                            ...(callBackView && {
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: '#2C5F75',
                                                    transform: 'scale(1.05)'
                                                },
                                                transition: 'all 0.2s ease-in-out'
                                            })
                                        }}
                                        {...(callBackView && {
                                            onClick: () => callBackView(visit.place.id)
                                        })}
                                    >
                                        <LocationCity sx={{ color: '#FFFFFF' }} />
                                    </StyledAvatar>
                                </ListItemAvatar>
                                
                                <ListItemText 
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            <PixelTypography
                                                component="span"
                                                variant="body2" 
                                                sx={{
                                                    fontSize: { xs: '0.6rem', sm: '0.8rem' },
                                                    color: '#2C2C2C',
                                                    ...(callBackView && {
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            color: '#3D5A80',
                                                            textDecoration: 'underline'
                                                        },
                                                        transition: 'all 0.2s ease-in-out'
                                                    })
                                                }}
                                                {...(callBackView && {
                                                    onClick: () => callBackView(visit.place.id)
                                                })}
                                            >
                                                {visit.place.name}
                                            </PixelTypography>
                                        </Box>
                                    }
                                    primaryTypographyProps={{ component: 'div' }}
                                    secondary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            {days && (
                                                <StyledChip
                                                    label={`${days} day${days > 1 ? 's' : ''}`} 
                                                    size="small" 
                                                    sx={{ fontSize: '0.5rem' }}
                                                />
                                            )}
                                            
                                            <StyledChip
                                                label={`${visit.place.Country.acronym} `} 
                                                size="small" 
                                                sx={{ 
                                                    fontSize: '0.5rem',
                                                    backgroundColor: '#52B788',
                                                    color: '#FFFFFF' 
                                                }}
                                            />
                                            <Divider flexItem sx={{ borderColor: '#2C2C2C' }} />
                                            <PixelTypography 
                                                component="span"
                                                variant="body2" 
                                                sx={{ 
                                                    color: '#000000', 
                                                    mt: 0.5,
                                                    fontSize: { xs: '0.5rem', sm: '0.6rem' }
                                                }}
                                            >
                                                {generateDateText(visit.initialdate, visit.finaldate)}
                                            </PixelTypography>
                                        </Box>
                                    }
                                    secondaryTypographyProps={{ component: 'div' }}
                                />
                            </StyledListItem>
                        );
                    })}
                </List>
            </StyledMainCard>
            
            {/* Results Counter */}
            {(showOnlyWithVotes || sortByVotes) && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <PixelTypography 
                        variant="body2" 
                        sx={{ 
                            fontSize: '0.6rem',
                            color: '#2C2C2C',
                            backgroundColor: '#E0AC69',
                            padding: '8px 16px',
                            border: '2px solid #2C2C2C'
                        }}
                    >
                        Showing {sortedByVotesItinerary.length} of {sortedItinerary.length} places
                        {showOnlyWithVotes && ' with votes'}
                        {sortByVotes && ' (sorted by votes)'}
                    </PixelTypography>
                </Box>
            )}
            
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
