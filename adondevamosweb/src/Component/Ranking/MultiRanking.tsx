import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Grid,
    Avatar
} from '@mui/material';
import {
    Place,
    FlightTakeoff
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import useRankingApi from '../../hooks/Ranking/useRankingApi';

const LeaderboardContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const LeaderboardRow = styled(Paper)<{ color: string }>(({ theme, color }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: 0,
    border: '3px solid #000000',
    boxShadow: '3px 3px 0px #000000',
    backgroundColor: color,
    cursor: 'pointer',
    imageRendering: 'pixelated',
    '&:hover': {
        transform: 'translateX(3px)',
        boxShadow: '5px 3px 0px #000000',
    },
    transition: 'all 0.2s ease',
    [theme.breakpoints.down('sm')]: {
        gap: theme.spacing(0.5),
        padding: theme.spacing(0.75),
    }
}));

const PositionBadge = styled(Avatar)<{ position: number }>(({ theme, position }) => ({
    width: 32,
    height: 32,
    backgroundColor: position === 1 ? '#FCFC00' : position === 2 ? '#A4A4A4' : '#FC7800',
    border: '2px solid #000000',
    marginBottom: theme.spacing(0.5),
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.7rem',
    color: '#000000',
    [theme.breakpoints.down('sm')]: {
        width: 26,
        height: 26,
        fontSize: '0.6rem',
    }
}));

const EntityName = styled(Typography)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.45rem',
    textAlign: 'center',
    color: '#000000',
    marginBottom: theme.spacing(0.5),
    wordBreak: 'break-word',
    lineHeight: 1.3,
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.4rem',
    }
}));

const VoteCount = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.3),
    backgroundColor: '#181818',
    color: '#FC5454',
    padding: theme.spacing(0.3, 0.5),
    borderRadius: 0,
    border: '2px solid #000000',
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.4rem',
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.35rem',
        padding: theme.spacing(0.2, 0.4),
    }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: '#000000',
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.6rem',
    }
}));

const LEADERBOARD_COLORS = {
    1: '#FCFC54', // 8-bit Gold/Yellow
    2: '#BCBCBC', // 8-bit Silver/Gray  
    3: '#FC9838'  // 8-bit Bronze/Orange
};

function MultiRanking() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { loading, error, getRanking } = useRankingApi();
    const [placesRanking, setPlacesRanking] = useState(null);
    const [tripsRanking, setTripsRanking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            setIsLoading(true);
            const [places, trips] = await Promise.all([
                getRanking('places', 3),
                getRanking('trips', 3)
            ]);
            setPlacesRanking(places);
            setTripsRanking(trips);
            setIsLoading(false);
        };
        fetchRankings();
    }, []);

    const handleLeaderboardClick = (item, entityType) => {
        if (entityType === 'places') {
            navigate(`/View/Place/${item.id}`);
        } else {
            navigate(`/View/Trip/${item.id}`);
        }
    };

    const renderLeaderboard = (rankingData, entityType) => {
        const ranking = rankingData?.ranking || [];
        
        if (ranking.length === 0) {
            return (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.5rem' }}>
                        {t('ranking.noVotesYet')}
                    </Typography>
                </Box>
            );
        }

        return (
            <LeaderboardContainer>
                {ranking.map((item, index) => {
                    const position = index + 1;
                    return (
                        <LeaderboardRow
                            key={item.id}
                            color={LEADERBOARD_COLORS[position] || '#FFFFFF'}
                            onClick={() => handleLeaderboardClick(item, entityType)}
                            elevation={0}
                        >
                            <PositionBadge position={position}>
                                {position}
                            </PositionBadge>
                            <EntityName>
                                {item.name || `#${item.id}`}
                            </EntityName>
                            <VoteCount>
                                ❤️ {item.Votes?.Total || 0}
                            </VoteCount>
                        </LeaderboardRow>
                    );
                })}
            </LeaderboardContainer>
        );
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper 
                        elevation={2} 
                        sx={{ 
                            p: 2, 
                            borderRadius: 0, 
                            border: '4px solid #000000',
                            boxShadow: '4px 4px 0px #000000',
                            backgroundColor: '#E8F4E8'
                        }}
                    >
                        <SectionTitle>
                            <Place sx={{ color: '#FC5454' }} />
                            {t('ranking.topPlaces')}
                        </SectionTitle>
                        {renderLeaderboard(placesRanking, 'places')}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper 
                        elevation={2} 
                        sx={{ 
                            p: 2, 
                            borderRadius: 0, 
                            border: '4px solid #000000',
                            boxShadow: '4px 4px 0px #000000',
                            backgroundColor: '#E8E8FC'
                        }}
                    >
                        <SectionTitle>
                            <FlightTakeoff sx={{ color: '#5454FC' }} />
                            {t('ranking.topTrips')}
                        </SectionTitle>
                        {renderLeaderboard(tripsRanking, 'trips')}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default MultiRanking;
