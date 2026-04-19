import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 
{
    Stack, 
    Button,
    CircularProgress,
    Typography,
    Box,
    ButtonGroup,
    Collapse,
    useMediaQuery, 
    useTheme,
    Card,
    CardContent,
    Grid,
    Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Flight, Search, Person, 
    ExpandMore, ExpandLess, LocationOn, AccessTime, People } from '@mui/icons-material';
import TripCard from "../Component/Trips/TripCard";
import TripCardSkeleton from "../Component/Trips/TripCardSkeleton";
import TripSkeletonList from "../Component/Trips/TripSkeletonList";
import NewTrips from "../Component/Trips/NewTrips";
import Ranking from "../Component/Ranking/Ranking";
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import { useAuth } from "../context/AuthContext";
import useRankingApi from "../hooks/Ranking/useRankingApi";

// 8-bit Styled Components
const StyledContainer = styled(Box)(({ theme }) => ({
    maxWidth: '800px',
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

const StyledSectionContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#E0AC69',
    padding: theme.spacing(2),
    '&:last-child': {
        paddingBottom: theme.spacing(2),
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: 0,
    border: '2px solid #2C2C2C',
    backgroundColor: '#FFFFFF',
    color: '#2C2C2C',
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.6rem',
    padding: theme.spacing(1.5, 2),
    '&:hover': {
        backgroundColor: '#F8F8F8',
        transform: 'translateY(-2px)',
        boxShadow: '3px 3px 0px #2C2C2C',
    },
    transition: 'all 0.2s ease-in-out',
}));

const PixelTypography = styled(Typography)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
}));

const StyledToggleButton = styled(Button)(({ theme }) => ({
    borderRadius: 0,
    border: '2px solid #2C2C2C',
    backgroundColor: '#FFFFFF',
    color: '#2C2C2C',
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.5rem',
    padding: theme.spacing(0.5, 1),
    minWidth: 'auto',
    '&:hover': {
        backgroundColor: '#F8F8F8',
        transform: 'translateY(-1px)',
        boxShadow: '2px 2px 0px #2C2C2C',
    },
    transition: 'all 0.2s ease-in-out',
}));

 const MainTrips = () => {
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
    const { isLogged, loading, hasRole, role } = useAuth();
    const { getRanking, loading: rankingLoading, rankingData } = useRankingApi();
    const [showNewTrips, setShowNewTrips] = useState(true);
    const [showRanking, setShowRanking] = useState(true);
    const [topTrips, setTopTrips] = useState([]);

    const generateUserSection = () => {
        if (hasRole('user')) {
            return (
                <StyledSectionCard>
                    <StyledSectionHeader>
                        <PixelTypography 
                            variant="h6" 
                            sx={{ 
                                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                color: '#FFFFFF'
                            }}
                        >
                            Create a New Trip
                        </PixelTypography>
                    </StyledSectionHeader>
                    <StyledSectionContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <StyledButton 
                                endIcon={<Flight sx={{ fontSize: '1rem' }} />}
                                href="/Create/Trip"
                            >
                                New Trip
                            </StyledButton>   
                        </Box>
                    </StyledSectionContent>
                </StyledSectionCard>
            );
        }
        return null;
    }
    useEffect(()=> {
        if (!loading) {
           
        }
    },[loading]);

    useEffect(() => {
        const fetchTopTrips = async () => {
            try {
                const data = await getRanking('trips', 3);
                if (data && data.ranking) {
                    setTopTrips(data.ranking);
                }
            } catch (error) {
                console.error('Error fetching top trips:', error);
            }
        };

        fetchTopTrips();
    }, [getRanking]);

    return (
        <CenteredTemplate>
            <StyledContainer>
                {/* Header Section */}
                <StyledHeaderCard>
                    <StyledHeaderContent>
                        <PixelTypography 
                            variant={isSmUp ? "h3" : "h4"} 
                            sx={{
                                fontSize: isSmUp ? '1.5rem' : '1.2rem',
                                color: '#FFFFFF',
                                mb: 2,
                                lineHeight: 1.4
                            }}
                        >
                            Trips
                        </PixelTypography>
                    </StyledHeaderContent>
                </StyledHeaderCard>

                {/* What is a Trip Section */}
                <StyledSectionCard>
                    <StyledSectionHeader>
                        <PixelTypography 
                            variant="h5" 
                            sx={{ 
                                fontSize: { xs: '0.8rem', sm: '1rem' },
                                color: '#FFFFFF'
                            }}
                        >
                            What is a Trip in AdondeVamos?
                        </PixelTypography>
                    </StyledSectionHeader>
                    <StyledSectionContent>
                        <PixelTypography 
                            variant="body2" 
                            sx={{ 
                                fontSize: { xs: '0.5rem', sm: '0.6rem' },
                                color: '#2C2C2C',
                                lineHeight: 1.6
                            }}
                        >
                            A trip is a list of places you want to visit with your friends.
                        </PixelTypography>
                    </StyledSectionContent>
                </StyledSectionCard>

                {/* Discover Trips Section */}
                <StyledSectionCard>
                    <StyledSectionHeader>
                        <PixelTypography 
                            variant="h5" 
                            sx={{ 
                                fontSize: { xs: '0.8rem', sm: '1rem' },
                                color: '#FFFFFF'
                            }}
                        >
                            Discover Trips
                        </PixelTypography>
                    </StyledSectionHeader>
                    <StyledSectionContent>
                        <PixelTypography 
                            variant="body2" 
                            sx={{ 
                                fontSize: { xs: '0.5rem', sm: '0.6rem' },
                                color: '#2C2C2C',
                                mb: 2,
                                lineHeight: 1.6
                            }}
                        >
                            Explore trips created by other users and get inspired for your next adventure!
                        </PixelTypography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <StyledButton 
                                endIcon={<Search sx={{ fontSize: '1rem' }} />}
                                href="/Search/Trips"
                            >
                                Search for trips
                            </StyledButton>
                        </Box>
                    </StyledSectionContent>
                </StyledSectionCard>

                {/* User Section */}
                {generateUserSection()}

                {/* New Trips Section */}
                <StyledSectionCard>
                    <StyledSectionHeader>
                        <PixelTypography 
                            variant="h5" 
                            sx={{ 
                                fontSize: { xs: '0.8rem', sm: '1rem' },
                                color: '#FFFFFF'
                            }}
                        >
                            New Trips
                        </PixelTypography>
                        <StyledToggleButton 
                            onClick={() => setShowNewTrips(!showNewTrips)}
                            endIcon={showNewTrips ? <ExpandLess sx={{ fontSize: '0.8rem' }} /> : <ExpandMore sx={{ fontSize: '0.8rem' }} />}
                        >
                            {showNewTrips ? 'Hide' : 'Show'}
                        </StyledToggleButton>
                    </StyledSectionHeader>
                    <Collapse in={showNewTrips}>
                        <StyledSectionContent>
                            <NewTrips topTrips={topTrips} />
                        </StyledSectionContent>
                    </Collapse>
                </StyledSectionCard>

                {/* Most Voted Trips Section */}
                <StyledSectionCard>
                    <StyledSectionHeader>
                        <PixelTypography 
                            variant="h5" 
                            sx={{ 
                                fontSize: { xs: '0.8rem', sm: '1rem' },
                                color: '#FFFFFF'
                            }}
                        >
                            Most Voted Trips
                        </PixelTypography>
                        <StyledToggleButton 
                            onClick={() => setShowRanking(!showRanking)}
                            endIcon={showRanking ? <ExpandLess sx={{ fontSize: '0.8rem' }} /> : <ExpandMore sx={{ fontSize: '0.8rem' }} />}
                        >
                            {showRanking ? 'Hide' : 'Show'}
                        </StyledToggleButton>
                    </StyledSectionHeader>
                    <Collapse in={showRanking}>
                        <StyledSectionContent>
                            <Ranking defaultEntityType="trips" showSelector={false} />
                        </StyledSectionContent>
                    </Collapse>
                </StyledSectionCard>
            </StyledContainer>
        </CenteredTemplate>
    );
 }
 export default MainTrips;