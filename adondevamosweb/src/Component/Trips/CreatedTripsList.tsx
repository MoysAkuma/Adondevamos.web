import { useNavigate } from 'react-router-dom';
import {
    List,
    Alert,
    Box
} from '@mui/material';
import TripListItem from './TripListItem';
import Pagination from '../Commons/Pagination';
import usePagination from '../../hooks/usePagination';
import {
    CreatedTripsSectionCard,
    CreatedTripsSectionHeader,
    CreatedTripsSectionContent,
    CreatedTripsHeaderText,
    createdTripsEmptyAlertSx,
    createdTripsListSx,
} from '../../Css/Trips/trips.styles';

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
            <CreatedTripsSectionCard>
                <CreatedTripsSectionContent>
                    <Alert 
                        severity="info"
                        sx={createdTripsEmptyAlertSx}
                    >
                        {emptyMessage}
                    </Alert>
                </CreatedTripsSectionContent>
            </CreatedTripsSectionCard>
        );
    }

    return (
        <CreatedTripsSectionCard>
            <CreatedTripsSectionHeader>
                <CreatedTripsHeaderText>
                    {title}
                </CreatedTripsHeaderText>
            </CreatedTripsSectionHeader>
            <CreatedTripsSectionContent>
                <List sx={createdTripsListSx}>
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
            </CreatedTripsSectionContent>
        </CreatedTripsSectionCard>
    );
}

export default CreatedTripsList;
