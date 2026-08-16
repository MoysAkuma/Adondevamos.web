import React from 'react';
import { useParams } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { Box, Card, CardContent, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { EmojiEvents } from '@mui/icons-material';
import Ranking from '../Component/Ranking/Ranking';
import MultiRanking from '../Component/Ranking/MultiRanking';
import CenteredTemplate from '../Component/Commons/CenteredTemplate';

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
    backgroundColor: '#FFD700',
}));

const StyledHeaderContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#3D5A80',
    color: '#2C2C2C',
    padding: theme.spacing(3),
    textAlign: 'center',
}));

const StyledSectionCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
}));

const StyledSectionContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#F5F5F5',
    padding: theme.spacing(2),
    '&:last-child': {
        paddingBottom: theme.spacing(2),
    },
}));

const PixelTypography = styled('div')(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
}));

function RankingPage() {
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
    const { entityType } = useParams();
    
    // Valid entity types
    const validTypes = ['places', 'trips', 'itineraries'];

    const entityLabel = entityType ? entityType.charAt(0).toUpperCase() + entityType.slice(1) : undefined;
    const pageTitle = entityLabel ? `${entityLabel} Ranking - AdondeVamos` : 'Rankings - AdondeVamos';
    useSeoMeta({
        title: pageTitle,
        description: entityLabel ? `See the top-ranked ${entityType} on AdondeVamos.` : 'See the top-ranked trips, places and itineraries on AdondeVamos.',
        ogTitle: pageTitle,
    });
    const showMulti = !entityType || !validTypes.includes(entityType);

    return (
        <CenteredTemplate>
            <StyledContainer>
                {/* Header Section */}
                <StyledHeaderCard>
                    <StyledHeaderContent>
                        <PixelTypography 
                            style={{
                                fontSize: isSmUp ? '1.5rem' : '1.2rem',
                                color: '#2C2C2C',
                                marginBottom: theme.spacing(1),
                                lineHeight: 1.4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: theme.spacing(2)
                            }}
                        >
                            <EmojiEvents sx={{ fontSize: isSmUp ? 48 : 40 }} />
                            Rankings
                        </PixelTypography>
                        <PixelTypography
                            style={{
                                fontSize: isSmUp ? '0.6rem' : '0.5rem',
                                color: '#2C2C2C',
                                lineHeight: 1.6,
                                marginTop: theme.spacing(1)
                            }}
                        >
                            Discover the best places and trips
                        </PixelTypography>
                    </StyledHeaderContent>
                </StyledHeaderCard>

                {/* Ranking Content Section */}
                <StyledSectionCard>
                    <StyledSectionContent>
                        {showMulti ? (
                            <MultiRanking />
                        ) : (
                            <Ranking defaultEntityType={entityType} showSelector={true} />
                        )}
                    </StyledSectionContent>
                </StyledSectionCard>
            </StyledContainer>
        </CenteredTemplate>
    );
}

export default RankingPage;
