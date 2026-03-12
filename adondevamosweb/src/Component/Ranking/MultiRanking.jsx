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
    EmojiEvents,
    Place,
    FlightTakeoff
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import useRankingApi from '../../hooks/Ranking/useRankingApi';

// Styled podium components
const PodiumContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    minHeight: 200,
    [theme.breakpoints.down('sm')]: {
        gap: theme.spacing(0.5),
        minHeight: 160,
    }
}));

const PodiumPlace = styled(Paper)(({ theme, position, color }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(1.5),
    borderRadius: 0,
    border: '3px solid #000000',
    boxShadow: '4px 4px 0px #000000',
    backgroundColor: color,
    width: position === 1 ? 100 : 85,
    minHeight: position === 1 ? 160 : position === 2 ? 130 : 110,
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
    imageRendering: 'pixelated',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '6px 6px 0px #000000',
    },
    [theme.breakpoints.down('sm')]: {
        width: position === 1 ? 80 : 70,
        minHeight: position === 1 ? 130 : position === 2 ? 105 : 85,
        padding: theme.spacing(1),
    }
}));

const PositionBadge = styled(Avatar)(({ theme, position }) => ({
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
    textShadow: '1px 1px 0px #FCFCFC',
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
    textShadow: '2px 2px 0px #FCFC54',
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.6rem',
    }
}));

const PODIUM_COLORS = {
    1: '#FCFC54', // 8-bit Gold/Yellow
    2: '#BCBCBC', // 8-bit Silver/Gray  
    3: '#FC9838'  // 8-bit Bronze/Orange
};

function MultiRanking() {
    const navigate = useNavigate();
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

    const handlePodiumClick = (item, entityType) => {
        if (entityType === 'places') {
            navigate(`/View/Place/${item.id}`);
        } else {
            navigate(`/View/Trip/${item.id}`);
        }
    };

    const getPodiumOrder = (ranking) => {
        if (!ranking || ranking.length === 0) return [];
        const ordered = [...ranking];
        while (ordered.length < 3) {
            ordered.push(null);
        }
        return [ordered[1], ordered[0], ordered[2]];
    };

    const renderPodium = (rankingData, entityType, label) => {
        const ranking = rankingData?.ranking || [];
        
        if (ranking.length === 0) {
            return (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.5rem' }}>
                        No votes yet
                    </Typography>
                </Box>
            );
        }

        const podiumOrder = getPodiumOrder(ranking);
        const positions = [2, 1, 3];

        return (
            <PodiumContainer>
                {podiumOrder.map((item, index) => {
                    if (!item) return null;
                    const position = positions[index];
                    return (
                        <PodiumPlace
                            key={item.id}
                            position={position}
                            color={PODIUM_COLORS[position]}
                            onClick={() => handlePodiumClick(item, entityType)}
                            elevation={position === 1 ? 6 : 3}
                        >
                            <PositionBadge position={position}>
                                {position === 1 ? <EmojiEvents sx={{ fontSize: 16 }} /> : position}
                            </PositionBadge>
                            <EntityName>
                                {item.name || `#${item.id}`}
                            </EntityName>
                            <VoteCount>
                                ❤️ {item.Votes?.Total || 0}
                            </VoteCount>
                        </PodiumPlace>
                    );
                })}
            </PodiumContainer>
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
                            Top Places
                        </SectionTitle>
                        {renderPodium(placesRanking, 'places', 'Places')}
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
                            Top Trips
                        </SectionTitle>
                        {renderPodium(tripsRanking, 'trips', 'Trips')}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default MultiRanking;
