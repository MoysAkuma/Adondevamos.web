import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Divider,
    Stack,
    Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocationOn, Email } from '@mui/icons-material';
import useProfileById from '../../hooks/Users/useProfileById';
import CreatedTripsList from '../Trips/CreatedTripsList';
import UserAvatar from '../Commons/UserAvatar';

// 8-bit Styled Components
const StyledContainer = styled(Box)(({ theme }) => ({
    maxWidth: '1000px',
    margin: '0 auto',
    padding: theme.spacing(2),
}));

const StyledHeaderCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    marginBottom: theme.spacing(3),
    backgroundColor: '#1E293B',
}));

const StyledHeaderContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#1E293B',
    color: '#FFFFFF',
    padding: theme.spacing(4),
    textAlign: 'center',
}));

const PixelTypography = styled(Typography)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
}));

const StyledInfoCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    marginBottom: theme.spacing(3),
    backgroundColor: '#F8FAFC',
}));

const StyledInfoContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#F8FAFC',
    padding: theme.spacing(3),
}));

const StyledEmailButton = styled(Button)(({ theme }) => ({
    borderRadius: 0,
    border: '3px solid #2C2C2C',
    boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
    backgroundColor: '#0F766E',
    color: '#FFFFFF',
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.6rem',
    padding: theme.spacing(1.5, 3),
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#134E4A',
        boxShadow: '6px 6px 0px rgba(0,0,0,0.4)',
        transform: 'translate(-1px, -1px)',
    },
    '&:active': {
        transform: 'translate(2px, 2px)',
        boxShadow: '2px 2px 0px rgba(0,0,0,0.3)',
    },
}));

function ViewUser() {
    const { id } = useParams();
    const { profileData, loading, error } = useProfileById(id);

    if (loading) {
        return (
            <StyledContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress 
                        sx={{ 
                            color: '#1E293B'
                        }} 
                    />
                </Box>
            </StyledContainer>
        );
    }

    if (error) {
        return (
            <StyledContainer>
                <Alert 
                    severity="error"
                    sx={{
                        borderRadius: 0,
                        border: '4px solid #2C2C2C',
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.7rem',
                        lineHeight: 1.6
                    }}
                >
                    {error}
                </Alert>
            </StyledContainer>
        );
    }

    if (!profileData || !profileData.user) {
        return (
            <StyledContainer>
                <Alert 
                    severity="warning"
                    sx={{
                        borderRadius: 0,
                        border: '4px solid #2C2C2C',
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.7rem',
                        lineHeight: 1.6
                    }}
                >
                    User not found
                </Alert>
            </StyledContainer>
        );
    }

    const { user, createdTrips, votedTrips, voteCounts } = profileData;

    return (
        <StyledContainer>
            {/* Header Section */}
            <StyledHeaderCard>
                <StyledHeaderContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <UserAvatar
                            name={user.name}
                            tag={user.tag}
                            size="xlarge"
                            sx={{
                                border: '4px solid #FFFFFF',
                                boxShadow: '6px 6px 0px rgba(0,0,0,0.4)'
                            }}
                        />
                    </Box>
                    <PixelTypography 
                        variant="h3" 
                        sx={{
                            fontSize: { xs: '1.2rem', sm: '1.8rem' },
                            color: '#FFFFFF',
                            mb: 1,
                            lineHeight: 1.4
                        }}
                    >
                        {user.tag}
                    </PixelTypography>
                    <Typography 
                        variant="h6" 
                        sx={{
                            fontSize: { xs: '0.9rem', sm: '1.1rem' },
                            color: '#E8F4FD',
                            fontWeight: 400
                        }}
                    >
                        {user.name} {user.lastname}
                    </Typography>
                </StyledHeaderContent>
            </StyledHeaderCard>

            {/* User Info Section */}
            <StyledInfoCard>
                <StyledInfoContent>
                    {user.description && (
                        <Box sx={{ mb: 3 }}>
                            <PixelTypography 
                                variant="body2" 
                                sx={{ 
                                    fontSize: '0.7rem',
                                    color: '#2C2C2C',
                                    mb: 2
                                }}
                            >
                                About
                            </PixelTypography>
                            <Typography 
                                variant="body1"
                                sx={{
                                    color: '#2C2C2C',
                                    lineHeight: 1.8,
                                    fontSize: '0.95rem'
                                }}
                            >
                                {user.description}
                            </Typography>
                        </Box>
                    )}

                    {user.Country && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <LocationOn sx={{ color: '#E63946' }} />
                            <Typography variant="body1" sx={{ color: '#2C2C2C' }}>
                                {user.City?.name}, {user.State?.name}, {user.Country?.acronym}
                            </Typography>
                        </Box>
                    )}

                    <Divider sx={{ my: 2, borderColor: '#2C2C2C', borderWidth: 2 }} />

                    <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap">
                        <Box sx={{ textAlign: 'center', minWidth: '100px' }}>
                            <PixelTypography 
                                variant="h4" 
                                sx={{ 
                                    fontSize: '1.5rem',
                                    color: '#E63946'
                                }}
                            >
                                {voteCounts?.trips + voteCounts?.places || 0}
                            </PixelTypography>
                            <PixelTypography 
                                variant="body2" 
                                sx={{ 
                                    fontSize: '0.6rem',
                                    color: '#2C2C2C',
                                    lineHeight: 1.4,
                                    mt: 1
                                }}
                            >
                                Votes
                            </PixelTypography>
                        </Box>
                        <Box sx={{ textAlign: 'center', minWidth: '100px' }}>
                            <PixelTypography 
                                variant="h4" 
                                sx={{ 
                                    fontSize: '1.5rem',
                                    color: '#1E293B'
                                }}
                            >
                                {voteCounts?.trips || 0}
                            </PixelTypography>
                            <PixelTypography 
                                variant="body2" 
                                sx={{ 
                                    fontSize: '0.6rem',
                                    color: '#2C2C2C',
                                    lineHeight: 1.4,
                                    mt: 1
                                }}
                            >
                                Trip Votes
                            </PixelTypography>
                        </Box>
                        <Box sx={{ textAlign: 'center', minWidth: '100px' }}>
                            <PixelTypography 
                                variant="h4" 
                                sx={{ 
                                    fontSize: '1.5rem',
                                    color: '#0F766E'
                                }}
                            >
                                {voteCounts?.places || 0}
                            </PixelTypography>
                            <PixelTypography 
                                variant="body2" 
                                sx={{ 
                                    fontSize: '0.6rem',
                                    color: '#2C2C2C',
                                    lineHeight: 1.4,
                                    mt: 1
                                }}
                            >
                                Place Votes
                            </PixelTypography>
                        </Box>
                    </Stack>

                    <Divider sx={{ my: 3, borderColor: '#2C2C2C', borderWidth: 2 }} />

                    <Box sx={{ textAlign: 'center' }}>
                        <StyledEmailButton
                            startIcon={<Email />}
                            onClick={() => {
                                window.location.href = `mailto:${user.email || ''}?subject=Hello from AdondeVamos`;
                            }}
                        >
                            Send Email
                        </StyledEmailButton>
                    </Box>
                </StyledInfoContent>
            </StyledInfoCard>

            {/* Trips Created Section - Shows last 3 */}
            <CreatedTripsList
                trips={createdTrips}
                showPagination={false}
                title="Recent Trips Created (Last 3)"
                emptyMessage="This user hasn't created any trips yet."
            />

            {/* Voted Trips Section - Shows last 3 */}
            <CreatedTripsList
                trips={votedTrips}
                showPagination={false}
                title="Recently Voted Trips (Last 3)"
                emptyMessage="This user hasn't voted on any trips yet."
            />
        </StyledContainer>
    );
}

export default ViewUser;