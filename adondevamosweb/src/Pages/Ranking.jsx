import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';
import Ranking from '../Component/Ranking/Ranking';
import MultiRanking from '../Component/Ranking/MultiRanking';
import CenteredTemplate from '../Component/Commons/CenteredTemplate';

function RankingPage() {
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
    const { entityType } = useParams();
    
    // Valid entity types
    const validTypes = ['places', 'trips', 'itineraries'];
    const showMulti = !entityType || !validTypes.includes(entityType);

    return (
        <CenteredTemplate>
            <Box sx={{ 
                width: '100%', 
                py: 2, 
                px: 2, 
                maxWidth: 900, 
                mx: 'auto', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}>
                <Typography 
                    variant={isSmUp ? "h4" : "h5"} 
                    align="center"
                    sx={{
                        fontFamily: "'Press Start 2P', cursive",
                        color: '#2c3e50',
                        fontSize: isSmUp ? '1.2rem' : '1rem',
                        lineHeight: 1.6,
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2
                    }}
                >
                    <EmojiEvents sx={{ color: '#FFD700', fontSize: isSmUp ? 40 : 32 }} />
                    Rankings
                </Typography>

                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    {showMulti ? (
                        <MultiRanking />
                    ) : (
                        <Ranking defaultEntityType={entityType} showSelector={true} />
                    )}
                </Box>
            </Box>
        </CenteredTemplate>
    );
}

export default RankingPage;
