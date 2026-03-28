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
import usePlaceQueryApi from '../hooks/Places/usePlaceQueryApi';

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
    const [searchResults, setSearchResults] = useState([]);
    const { searchPlaces } = usePlaceQueryApi();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
    const [catalogues, setCatalogues] = useState({
        countries: [],
        states: [],
        cities: [],
        facilities: []
    });
    
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
                <StyledResultsCard>
                    <StyledResultsContent>
                        <TripsResultSearch results={searchResults} />
                    </StyledResultsContent>
                </StyledResultsCard>
            );
        }
        if(opt === "Places"){
            return (
                <StyledResultsCard>
                    <StyledResultsContent>
                        <PlacesResultSearch results={searchResults} />
                    </StyledResultsContent>
                </StyledResultsCard>
            );
        }
    }
    
    const searchTripsByFilters = async (filters) => {
        axios.post(
            `${config.api.baseUrl}${config.api.endpoints.Trips}/Search`,
            {
                filters : filters
            }
        ).then( (response) => {

            setSearchResults( response.data.info );
        }).catch( (error) => {
            if (error.response?.status === 404) {
                setSearchResults([]);
                setSnackbar({ open: true, message: 'No data was found', severity: 'warning' });
            } else {
                console.error("There was an error searching trips by filters!", error);
                setSnackbar({ open: true, message: 'Error searching trips', severity: 'error' });
            }
        });    
    }

    const searchPlacessByFilters = async (filters) => {
        searchPlaces(filters)
            .then((response) => {
                
                setSearchResults(response.data.info);
            })
            .catch((error) => {
                if (error.response?.status === 404) {
                    setSearchResults([]);
                    setSnackbar({ open: true, message: 'No data was found', severity: 'warning' });
                } else {
                    console.error("There was an error searching places by filters!", error);
                    setSnackbar({ open: true, message: 'Error searching places', severity: 'error' });
                }
            });
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