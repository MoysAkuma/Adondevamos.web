import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Typography, Snackbar, Alert, Card, CardContent, Box } from "@mui/material";
import { styled } from '@mui/material/styles';
import axios from 'axios';

import config from "../Resources/config";
import TripFilters from "../Component/Trips/TripFilters";
import PlaceFilter from "../Component/Places/PlaceFilter";
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import TripsResultSearch from "../Component/Trips/TripsResultSearch";
import PlacesResultSearch from "../Component/Places/PlacesResultSearch";
import Pagination from "../Component/Commons/Pagination";
import usePlaceQueryApi from '../hooks/Places/usePlaceQueryApi';
import useTripQueryApi from '../hooks/Trips/useTripQueryApi';
import useSearch from '../hooks/useSearch';
import usePagination from '../hooks/usePagination';

// 8-bit Styled Components
const StyledContainer = styled(Box)(({ theme }) => ({
    maxWidth: '900px',
    margin: '0 auto',
    padding: theme.spacing(2),
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

const StyledFiltersCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    marginBottom: theme.spacing(3),
    backgroundColor: '#52B788',
}));

const StyledFiltersHeader = styled(Box)(({ theme }) => ({
    backgroundColor: '#52B788',
    padding: theme.spacing(2),
    borderBottom: '4px solid #2C2C2C',
}));

const StyledFiltersContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#E0AC69',
    padding: theme.spacing(2),
    '&:last-child': {
        paddingBottom: theme.spacing(2),
    },
}));

const StyledResultsCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    backgroundColor: '#E0AC69',
}));

const StyledResultsContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#E0AC69',
    padding: theme.spacing(2),
    '&:last-child': {
        paddingBottom: theme.spacing(2),
    },
}));

const PixelTypography = styled(Typography)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
}));


export default function Search() {
    //Module to show the search page
    const { opt } = useParams();
    const { searchPlaces } = usePlaceQueryApi();
    const { searchTrips } = useTripQueryApi();
    
    // Use the reusable search hooks for both trips and places
    const tripsSearch = useSearch(searchTrips);
    const placesSearch = useSearch(searchPlaces);
    
    // Pagination configuration
    const paginationConfig = {
        initialPage: 1,
        itemsPerPage: 5,
        pageSizeOptions: [5, 10, 20, 50]
    };
    
    // Pagination hooks for both trips and places
    const tripsPagination = usePagination(tripsSearch.results, paginationConfig);
    const placesPagination = usePagination(placesSearch.results, paginationConfig);
    
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
    const [catalogues, setCatalogues] = useState({
        countries: [],
        states: [],
        cities: [],
        facilities: []
    });
    
    // Determine which search and pagination to use based on the current option
    const currentSearch = opt === "Trips" ? tripsSearch : placesSearch;
    const currentPagination = opt === "Trips" ? tripsPagination : placesPagination;
    const searchResults = currentSearch.results;
    
    useEffect(() => {
        // Fetch catalogues data once when component mounts
        axios.get(`${config.api.baseUrl}${config.api.endpoints.Catalogues}/all`)
            .then((response) => {
                setCatalogues(response.data.info);
            })
            .catch((error) => {
                console.error("Error fetching catalogues:", error);
            });
    }, []);
    
    const controlViewOption = (opt) => {
        if (opt === "Trips") {
            return (
                <>
                    <StyledFiltersCard>
                        <StyledFiltersHeader>
                            <PixelTypography 
                                variant="h6" 
                                sx={{ 
                                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                    color: '#FFFFFF'
                                }}
                            >
                                Trip Filters
                            </PixelTypography>
                        </StyledFiltersHeader>
                        <StyledFiltersContent>
                            <TripFilters searchMethod={searchTripsByFilters} />
                        </StyledFiltersContent>
                    </StyledFiltersCard>
                    {(searchResults.length !== 0) && controlViewResult(opt)}
                </>
            );
        }
        if (opt === "Places"){
            return (
                <>
                    <StyledFiltersCard>
                        <StyledFiltersHeader>
                            <PixelTypography 
                                variant="h6" 
                                sx={{ 
                                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                    color: '#FFFFFF'
                                }}
                            >
                                Place Filters
                            </PixelTypography>
                        </StyledFiltersHeader>
                        <StyledFiltersContent>
                            <PlaceFilter 
                                searchMethod={searchPlacessByFilters}
                                countries={catalogues.countries}
                                states={catalogues.states}
                                cities={catalogues.cities}
                                facilitiesOptions={catalogues.facilities}
                            />
                        </StyledFiltersContent>
                    </StyledFiltersCard>
                    {(searchResults.length !== 0) && controlViewResult(opt)}
                </>
            );
        }
    }

    const controlViewResult = (opt) => {
        if (searchResults.length === 0 ) return <></>;
        if (opt === "Trips") {
            return (
                <>
                    <StyledResultsCard>
                        <StyledResultsContent>
                            <TripsResultSearch results={tripsPagination.paginatedItems} />
                        </StyledResultsContent>
                    </StyledResultsCard>
                    <Pagination
                        currentPage={tripsPagination.currentPage}
                        totalPages={tripsPagination.totalPages}
                        itemsPerPage={tripsPagination.itemsPerPage}
                        pageSizeOptions={tripsPagination.pageSizeOptions}
                        totalItems={tripsPagination.totalItems}
                        startItem={tripsPagination.startItem}
                        endItem={tripsPagination.endItem}
                        hasNextPage={tripsPagination.hasNextPage}
                        hasPrevPage={tripsPagination.hasPrevPage}
                        goToPage={tripsPagination.goToPage}
                        nextPage={tripsPagination.nextPage}
                        prevPage={tripsPagination.prevPage}
                        goToFirstPage={tripsPagination.goToFirstPage}
                        goToLastPage={tripsPagination.goToLastPage}
                        changeItemsPerPage={tripsPagination.changeItemsPerPage}
                        getPageNumbers={tripsPagination.getPageNumbers}
                        showFirstLast={true}
                        showPageSize={true}
                        showInfo={true}
                    />
                </>
            );
        }
        if(opt === "Places"){
            return (
                <>
                    <StyledResultsCard>
                        <StyledResultsContent>
                            <PlacesResultSearch results={placesPagination.paginatedItems} />
                        </StyledResultsContent>
                    </StyledResultsCard>
                    <Pagination
                        currentPage={placesPagination.currentPage}
                        totalPages={placesPagination.totalPages}
                        itemsPerPage={placesPagination.itemsPerPage}
                        pageSizeOptions={placesPagination.pageSizeOptions}
                        totalItems={placesPagination.totalItems}
                        startItem={placesPagination.startItem}
                        endItem={placesPagination.endItem}
                        hasNextPage={placesPagination.hasNextPage}
                        hasPrevPage={placesPagination.hasPrevPage}
                        goToPage={placesPagination.goToPage}
                        nextPage={placesPagination.nextPage}
                        prevPage={placesPagination.prevPage}
                        goToFirstPage={placesPagination.goToFirstPage}
                        goToLastPage={placesPagination.goToLastPage}
                        changeItemsPerPage={placesPagination.changeItemsPerPage}
                        getPageNumbers={placesPagination.getPageNumbers}
                        showFirstLast={true}
                        showPageSize={true}
                        showInfo={true}
                    />
                </>
            );
        }
    }
    
    const searchTripsByFilters = async (filters) => {
        const result = await tripsSearch.search(filters);
        
        if (!result.success) {
            if (result.error.status === 404) {
                setSnackbar({ open: true, message: 'No trips found', severity: 'info' });
            } else {
                console.error("Error searching trips:", result.error);
                setSnackbar({ open: true, message: 'Error searching trips', severity: 'error' });
            }
        }
    }

    const searchPlacessByFilters = async (filters) => {
        const result = await placesSearch.search(filters);
        
        if (!result.success) {
            if (result.error.status === 404) {
                setSnackbar({ open: true, message: 'No places found', severity: 'info' });
            } else {
                console.error("Error searching places:", result.error);
                setSnackbar({ open: true, message: 'Error searching places', severity: 'error' });
            }
        }
    }

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <>
            <CenteredTemplate>
                <StyledContainer>
                    {/* Header Section */}
                    <StyledHeaderCard>
                        <StyledHeaderContent>
                            <PixelTypography 
                                variant="h4" 
                                sx={{
                                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                                    color: '#FFFFFF',
                                    mb: 1,
                                    lineHeight: 1.4
                                }}
                            >
                                Discover {opt}
                            </PixelTypography>
                        </StyledHeaderContent>
                    </StyledHeaderCard>
                    
                    {/* Search Content */}
                    {controlViewOption(opt)}
                </StyledContainer>
            </CenteredTemplate>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}