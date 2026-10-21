import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSeoMeta } from '@unhead/react';
import {
  Stack,
  CircularProgress,
  Box,
  Collapse,
  useMediaQuery,
  useTheme,
  Grid,
  Skeleton,
} from '@mui/material';
import { Flight, Search, ExpandMore, ExpandLess } from '@mui/icons-material';
import TripCard from '../Component/Trips/TripCard';
import TripCardSkeleton from '../Component/Trips/TripCardSkeleton';
import TripSkeletonList from '../Component/Trips/TripSkeletonList';
import NewTrips from '../Component/Trips/NewTrips';
import Ranking from '../Component/Ranking/Ranking';
import CenteredTemplate from '../Component/Commons/CenteredTemplate';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import useRankingApi from '../hooks/Ranking/useRankingApi';
import {
  PixelTypography,
  StyledContainer,
  StyledHeaderCard,
  StyledHeaderContent,
  StyledSectionCard,
  StyledSectionHeader,
  StyledSectionContent,
  StyledButton,
  ToggleButton,
  RankingTrip,
} from '../Css/MainTrips.styles';

 const MainTrips = () => {
    const { t } = useTranslation();
    useSeoMeta({
        title: t('trips.pageTitle'),
        description: t('trips.pageDescription'),
        ogTitle: t('trips.pageTitle'),
    });
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
    const { isLogged, loading, hasRole, role } = useAuth();
    const { getRanking, loading: rankingLoading, rankingData } = useRankingApi();
    const [showNewTrips, setShowNewTrips] = useState<boolean>(true);
    const [showRanking, setShowRanking] = useState<boolean>(true);
    const [topTrips, setTopTrips] = useState<RankingTrip[]>([]);

    const generateUserSection = (): React.ReactElement | null => {
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
                            {t('trips.createNew')}
                        </PixelTypography>
                    </StyledSectionHeader>
                    <StyledSectionContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <StyledButton 
                                endIcon={<Flight sx={{ fontSize: '1rem' }} />}
                                href="/Create/Trip"
                            >
                                {t('trips.new')}
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
                            {t('navigation.trips')}
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
                            {t('trips.whatIs')}
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
                            {t('trips.description')}
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
                            {t('trips.discover')}
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
                            {t('trips.discoverDescription')}
                        </PixelTypography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <StyledButton 
                                endIcon={<Search sx={{ fontSize: '1rem' }} />}
                                href="/Search/Trips"
                            >
                                {t('trips.search')}
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
                            {t('trips.newTrips')}
                        </PixelTypography>
                        <ToggleButton 
                            onClick={() => setShowNewTrips(!showNewTrips)}
                            endIcon={showNewTrips ? <ExpandLess sx={{ fontSize: '0.8rem' }} /> : <ExpandMore sx={{ fontSize: '0.8rem' }} />}
                        >
                            {showNewTrips ? t('trips.hide') : t('trips.show')}
                        </ToggleButton>
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
                            {t('trips.mostVoted')}
                        </PixelTypography>
                        <ToggleButton 
                            onClick={() => setShowRanking(!showRanking)}
                            endIcon={showRanking ? <ExpandLess sx={{ fontSize: '0.8rem' }} /> : <ExpandMore sx={{ fontSize: '0.8rem' }} />}
                        >
                            {showRanking ? t('trips.hide') : t('trips.show')}
                        </ToggleButton>
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