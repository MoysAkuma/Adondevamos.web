import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    List,
    Alert,
    Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TripListItem from './TripListItem';
import Pagination from '../Commons/Pagination';
import usePagination from '../../hooks/usePagination';

const StyledSectionCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    marginBottom: theme.spacing(3),
}));

const StyledSectionHeader = styled(Box)(({ theme }) => ({
    backgroundColor: '#0F766E',
    padding: theme.spacing(2),
    borderBottom: '4px solid #2C2C2C',
}));

const StyledSectionContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#F8FAFC',
    padding: theme.spacing(3),
    '&:last-child': {
        paddingBottom: theme.spacing(3),
    },
}));

const PixelTypography = styled('div')(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '1rem',
    color: '#FFFFFF',
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
    },
}));

/**
 * Reusable component for displaying created trips
 * @param {Object} props
 * @param {Array} props.trips - Array of trip objects
 * @param {boolean} props.showPagination - Whether to show pagination (true) or limit to 3 items (false)
 * @param {string} props.title - Section title
 * @param {string} props.emptyMessage - Message to show when no trips
 * @returns {JSX.Element}
 */
function CreatedTripsList({ 
    trips = [], 
    showPagination = false, 
    title = "Created Trips",
    emptyMessage = "No trips created yet."
}) {
    const navigate = useNavigate();
    
    // Apply pagination only if showPagination is true
    const displayTrips = showPagination ? trips : trips.slice(0, 3);
    
    // Pagination hook (only used when showPagination is true)
    const {
        paginatedItems,
        currentPage,
        totalPages,
        itemsPerPage,
        goToPage,
        nextPage,
        previousPage,
        goToFirstPage,
        goToLastPage,
        changeItemsPerPage,
        hasNextPage,
        hasPreviousPage,
        startItem,
        endItem,
        getPageNumbers
    } = usePagination(displayTrips, {
        initialPage: 1,
        itemsPerPage: 10,
        pageSizeOptions: [5, 10, 20, 50]
    });

    // Use paginated items if pagination is enabled, otherwise use displayTrips
    const tripsToRender = showPagination ? paginatedItems : displayTrips;

    const handleViewTrip = (tripId) => {
        if (!tripId) return;
        navigate('/View/Trip/' + tripId);
    };

    if (!trips || trips.length === 0) {
        return (
            <StyledSectionCard>
                <StyledSectionContent>
                    <Alert 
                        severity="info"
                        sx={{
                            borderRadius: 0,
                            border: '2px solid #2C2C2C',
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.6rem',
                            lineHeight: 1.6
                        }}
                    >
                        {emptyMessage}
                    </Alert>
                </StyledSectionContent>
            </StyledSectionCard>
        );
    }

    return (
        <StyledSectionCard>
            <StyledSectionHeader>
                <PixelTypography>
                    {title}
                </PixelTypography>
            </StyledSectionHeader>
            <StyledSectionContent>
                <List sx={{ width: '100%', padding: 0 }}>
                    {tripsToRender.map((trip) => (
                        <TripListItem
                            key={trip.id}
                            trip={trip}
                            onView={handleViewTrip}
                        />
                    ))}
                </List>
                
                {showPagination && trips.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={displayTrips.length}
                        startItem={startItem}
                        endItem={endItem}
                        hasNextPage={hasNextPage}
                        hasPrevPage={hasPreviousPage}
                        goToPage={goToPage}
                        nextPage={nextPage}
                        prevPage={previousPage}
                        goToFirstPage={goToFirstPage}
                        goToLastPage={goToLastPage}
                        changeItemsPerPage={changeItemsPerPage}
                        getPageNumbers={getPageNumbers}
                        pageSizeOptions={[5, 10, 20, 50]}
                    />
                )}
            </StyledSectionContent>
        </StyledSectionCard>
    );
}

export default CreatedTripsList;
