import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    ToggleButton,
    ToggleButtonGroup,
    Avatar
} from '@mui/material';
import {
    EmojiEvents,
    Place,
    FlightTakeoff,
    Map
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import useRankingApi from '../../hooks/Ranking/useRankingApi';
import TripCardSkeleton from '../Trips/TripCardSkeleton';

const LeaderboardContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
}));

const LeaderboardRow = styled(Paper)<{ color: string }>(({ theme, color }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.5),
    borderRadius: 0,
    border: '4px solid #000000',
    boxShadow: '4px 4px 0px #000000',
    backgroundColor: color,
    cursor: 'pointer',
    imageRendering: 'pixelated',
    '&:hover': {
        transform: 'translateX(4px)',
        boxShadow: '7px 4px 0px #000000',
    },
    transition: 'all 0.2s ease',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
    }
}));

const PositionBadge = styled(Avatar)<{ position: number }>(({ theme, position }) => ({
    width: 48,
    height: 48,
    backgroundColor: position === 1 ? '#FCFC00' : position === 2 ? '#A4A4A4' : '#FC7800',
    border: '3px solid #000000',
    marginBottom: theme.spacing(1),
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '1rem',
    color: '#000000',
    [theme.breakpoints.down('sm')]: {
        width: 36,
        height: 36,
        fontSize: '0.8rem',
    }
}));

const EntityName = styled(Typography)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.6rem',
    textAlign: 'center',
    color: '#000000',
    marginBottom: theme.spacing(1),
    wordBreak: 'break-word',
    lineHeight: 1.4,
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.5rem',
    }
}));

const VoteCount = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    backgroundColor: '#181818',
    color: '#FC5454',
    padding: theme.spacing(0.5, 1),
    borderRadius: 0,
    border: '2px solid #000000',
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.5rem',
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.4rem',
        padding: theme.spacing(0.3, 0.5),
    }
}));

const LEADERBOARD_COLORS = {
    1: '#FCFC54', // 8-bit Gold/Yellow
    2: '#BCBCBC', // 8-bit Silver/Gray  
    3: '#FC9838'  // 8-bit Bronze/Orange
};

const ENTITY_ICONS = {
    places: <Place />,
    trips: <FlightTakeoff />,
    itineraries: <Map />
};

const ENTITY_LABELS = {
    places: 'Places',
    trips: 'Trips',
    itineraries: 'Itineraries'
};

function Ranking({ defaultEntityType = 'places', showSelector = true }) {
    const navigate = useNavigate();
    const { loading, error, rankingData, getRanking, validEntityTypes } = useRankingApi();
    const [entityType, setEntityType] = useState(defaultEntityType);

    useEffect(() => {
        if (validEntityTypes.includes(entityType)) {
            getRanking(entityType, 3);
        }
    }, [entityType, getRanking, validEntityTypes]);

    const handleEntityTypeChange = (event, newType) => {
        if (newType !== null) {
            setEntityType(newType);
        }
    };

    const handleLeaderboardClick = (item) => {
        if (entityType === 'places') {
            navigate(`/View/Place/${item.id}`);
        } else if (entityType === 'trips' || entityType === 'itineraries') {
            navigate(`/View/Trip/${item.id}`);
        }
    };

    const renderLeaderboard = () => {
        if (!rankingData?.ranking || rankingData.ranking.length === 0) {
            return (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                        No votes yet for {ENTITY_LABELS[entityType]}
                    </Typography>
                </Box>
            );
        }

        return (
            <LeaderboardContainer>
                {rankingData.ranking.map((item, index) => {
                    const position = index + 1;
                    return (
                        <LeaderboardRow
                            key={item.id}
                            color={LEADERBOARD_COLORS[position] || '#FFFFFF'}
                            onClick={() => handleLeaderboardClick(item)}
                            elevation={0}
                        >
                            <PositionBadge position={position}>
                                {position}
                            </PositionBadge>
                            <EntityName sx={{ flex: 1, textAlign: 'left', mb: 0 }}>
                                {item.name || `${ENTITY_LABELS[entityType]} #${item.id}`}
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

    return (
        <Box sx={{ width: '100%' }}>
            <Typography 
                variant="h6" 
                component="h2" 
                gutterBottom 
                align="center"
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: 1,
                    color: '#000000'
                }}
            >
                <EmojiEvents sx={{ color: '#FCFC00' }} />
                Top Voted {ENTITY_LABELS[entityType]}
            </Typography>

            {showSelector && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <ToggleButtonGroup
                        value={entityType}
                        exclusive
                        onChange={handleEntityTypeChange}
                        aria-label="entity type"
                        size="small"
                        sx={{
                            '& .MuiToggleButton-root': {
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '0.5rem',
                                borderRadius: 0,
                                border: '1px solid #000000',
                                backgroundColor: '#BCBCBC',
                                color: '#000000',
                                '&:hover': {
                                    backgroundColor: '#54FC54',
                                },
                                '&.Mui-selected': {
                                    backgroundColor: '#5454FC',
                                    color: '#FCFCFC',
                                    border: '3px solid #000000',
                                    '&:hover': {
                                        backgroundColor: '#3838D8',
                                    }
                                }
                            }
                        }}
                    >
                        {validEntityTypes.map((type) => (
                            <ToggleButton key={type} value={type}>
                                {ENTITY_ICONS[type]}
                                <Box sx={{ ml: 0.5, display: { xs: 'none', sm: 'block' } }}>
                                    {ENTITY_LABELS[type]}
                                </Box>
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>
            )}

            {loading && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
                    {Array.from({ length: 3 }, (_, index) => (
                        <TripCardSkeleton key={index} />
                    ))}
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && renderLeaderboard()}
        </Box>
    );
}

export default Ranking;
