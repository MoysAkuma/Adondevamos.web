import { useState } from 'react';
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Container,
        Typography,
        Box,
        MenuItem,
        FormGroup,
        FormControlLabel,
        Checkbox,
        InputAdornment,
        IconButton,
        List,
        ListItem,
        ListItemText,
        Card,
        CardContent
        
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { Add, Delete } from '@mui/icons-material';

// 8-bit Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    backgroundColor: '#E0AC69',
    overflow: 'visible',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    backgroundColor: '#E0AC69',
    borderBottom: '2px solid #2C2C2C',
    '&:hover': {
        backgroundColor: '#D4956B',
        transform: 'translateX(2px)',
    },
    transition: 'all 0.2s ease-in-out',
    '&:last-child': {
        borderBottom: 'none',
    },
}));

const StyledActionButton = styled(IconButton)(({ theme }) => ({
    color: '#2C2C2C',
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    border: '2px solid #2C2C2C',
    padding: theme.spacing(1),
    margin: theme.spacing(0, 0.25),
    '&:hover': {
        backgroundColor: '#F8F8F8',
        transform: 'translateY(-2px)',
        boxShadow: '3px 3px 0px #2C2C2C',
    },
    transition: 'all 0.2s ease-in-out',
}));

const PixelTypography = styled(Typography)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
    textShadow: '2px 2px 0px #2C2C2C',
    color: '#2C2C2C',
}));


function Memberlist({ members}){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <StyledContainer maxWidth="sm">
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%'
            }}>
                <StyledCard>
                    <CardContent sx={{ p: 0 }}>
                        <List sx={{ width: '100%' }}>
                            {
                                members.length > 0 ? members.map(
                                    (x)=>(
                                        <StyledListItem key={x.id}>
                                            <ListItemText 
                                                primary={
                                                    <PixelTypography 
                                                        variant="body1"
                                                        sx={{ fontSize: { xs: '0.6rem', sm: '0.8rem' } }}
                                                    >
                                                        {x.name}
                                                    </PixelTypography>
                                                }
                                                secondary={
                                                    <PixelTypography 
                                                        variant="body2"
                                                        sx={{ 
                                                            fontSize: { xs: '0.5rem', sm: '0.6rem' },
                                                            color: '#5A5A5A',
                                                            textShadow: 'none'
                                                        }}
                                                    >
                                                        {x.description}
                                                    </PixelTypography>
                                                }
                                            />
                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                <StyledActionButton edge="end" aria-label="add">
                                                    <Add />
                                                </StyledActionButton>
                                                <StyledActionButton edge="end" aria-label="delete">
                                                    <Delete />
                                                </StyledActionButton>
                                            </Box> 
                                        </StyledListItem>
                                )) : 
                                <StyledListItem> 
                                    <ListItemText 
                                        primary={
                                            <PixelTypography 
                                                variant="body1"
                                                sx={{ 
                                                    fontSize: { xs: '0.6rem', sm: '0.8rem' },
                                                    textAlign: 'center',
                                                    py: 2
                                                }}
                                            >
                                                No members added yet
                                            </PixelTypography>
                                        }
                                    />
                                </StyledListItem>
                            }
                        </List>
                    </CardContent>
                </StyledCard>
            </Box>
        </StyledContainer>
    );
}

export default Memberlist;
