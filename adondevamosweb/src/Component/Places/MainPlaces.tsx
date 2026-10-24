import React from "react";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button, ButtonGroup, 
    Collapse, Box, useMediaQuery,
  useTheme, Card, CardContent } from "@mui/material";
import { styled } from '@mui/material/styles';
import { LocationCity, Search, Person,
    ExpandLess, ExpandMore
 } from '@mui/icons-material';
import PlaceCard from "./PlaceCard";
import NewPlaces from "./NewPlaces";
import Ranking from "../Ranking/Ranking";
import CenteredTemplate from "../Commons/CenteredTemplate";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from 'react-i18next';

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

export default function MainPlaces() {
    const { t } = useTranslation();
    const [UserSection, setUserSection] = useState(null);
    const { isLogged, loading, hasRole, role } = useAuth();
    const [showNewPlaces, setShowNewPlaces] = useState(true);
    const [showRanking, setShowRanking] = useState(true);
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
    
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
                            {t('places.createNew')}
                        </PixelTypography>
                    </StyledSectionHeader>
                    <StyledSectionContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <StyledButton 
                                endIcon={<LocationCity sx={{ fontSize: '1rem' }} />}
                                href="/Create/Place"
                            >
                                {t('places.new')}
                            </StyledButton>   
                        </Box>
                    </StyledSectionContent>
                </StyledSectionCard>
            );
        }
        return null;
    };

    useEffect(() => {
        if (!loading) {
           
        }
    }, [loading, isLogged]);

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
                            {t('navigation.places')}
                        </PixelTypography>
                    </StyledHeaderContent>
                </StyledHeaderCard>

                {/* What is a Place Section */}
                <StyledSectionCard>
                    <StyledSectionHeader>
                        <PixelTypography 
                            variant="h5" 
                            sx={{ 
                                fontSize: { xs: '0.8rem', sm: '1rem' },
                                color: '#FFFFFF'
                            }}
                        >
                            {t('places.whatIs')}
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
                            {t('places.description')}
                        </PixelTypography>
                    </StyledSectionContent>
                </StyledSectionCard>

                {/* Discover Places Section */}
                <StyledSectionCard>
                    <StyledSectionHeader>
                        <PixelTypography 
                            variant="h5" 
                            sx={{ 
                                fontSize: { xs: '0.8rem', sm: '1rem' },
                                color: '#FFFFFF'
                            }}
                        >
                            {t('places.discover')}
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
                            {t('places.discoverDescription')}
                        </PixelTypography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <StyledButton 
                                endIcon={<Search sx={{ fontSize: '1rem' }} />}
                                href="/Search/Places"
                            >
                                {t('places.search')}
                            </StyledButton>
                        </Box>
                    </StyledSectionContent>
                </StyledSectionCard>

                {/* User Section */}
                {hasRole('user') && generateUserSection()}

                {/* New Places Section */}
                <StyledSectionCard>
                    <StyledSectionHeader>
                        <PixelTypography 
                            variant="h5" 
                            sx={{ 
                                fontSize: { xs: '0.8rem', sm: '1rem' },
                                color: '#FFFFFF'
                            }}
                        >
                            {t('places.newPlaces')}
                        </PixelTypography>
                        <StyledToggleButton 
                            onClick={() => setShowNewPlaces(!showNewPlaces)}
                            endIcon={showNewPlaces ? <ExpandLess sx={{ fontSize: '0.8rem' }} /> : <ExpandMore sx={{ fontSize: '0.8rem' }} />}
                        >
                            {showNewPlaces ? t('trips.hide') : t('trips.show')}
                        </StyledToggleButton>
                    </StyledSectionHeader>
                    <Collapse in={showNewPlaces}>
                        <StyledSectionContent>
                            <NewPlaces />
                        </StyledSectionContent>
                    </Collapse>
                </StyledSectionCard>

                {/* Most Voted Places Section */}
                <StyledSectionCard>
                    <StyledSectionHeader>
                        <PixelTypography 
                            variant="h5" 
                            sx={{ 
                                fontSize: { xs: '0.8rem', sm: '1rem' },
                                color: '#FFFFFF'
                            }}
                        >
                            {t('places.mostVoted')}
                        </PixelTypography>
                        <StyledToggleButton 
                            onClick={() => setShowRanking(!showRanking)}
                            endIcon={showRanking ? <ExpandLess sx={{ fontSize: '0.8rem' }} /> : <ExpandMore sx={{ fontSize: '0.8rem' }} />}
                        >
                            {showRanking ? t('trips.hide') : t('trips.show')}
                        </StyledToggleButton>
                    </StyledSectionHeader>
                    <Collapse in={showRanking}>
                        <StyledSectionContent>
                            <Ranking defaultEntityType="places" showSelector={false} />
                        </StyledSectionContent>
                    </Collapse>
                </StyledSectionCard>
            </StyledContainer>
        </CenteredTemplate>
    );
}