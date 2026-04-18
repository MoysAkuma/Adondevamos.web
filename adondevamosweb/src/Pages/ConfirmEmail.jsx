import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Container
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import config from '../Resources/config';

// 8-bit Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
    maxWidth: '600px !important',
    margin: '0 auto',
    padding: theme.spacing(4),
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    backgroundColor: '#E0AC69',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#E0AC69',
    padding: theme.spacing(4),
    textAlign: 'center',
    '&:last-child': {
        paddingBottom: theme.spacing(4),
    },
}));

const PixelTypography = styled(Typography)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
}));

function ConfirmEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const confirmEmail = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('No confirmation token provided.');
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            try {
                const response = await axios.get(
                    `${config.api.baseUrl}${config.api.endpoints.Users}/ConfirmEmail`,
                    {
                        params: { token }
                    }
                );

                if (response.status === 200) {
                    setStatus('success');
                    setMessage('Email confirmed successfully! Redirecting to home...');
                    setTimeout(() => navigate('/'), 3000);
                }
            } catch (error) {
                setStatus('error');
                const errorMessage = error.response?.data?.message || 
                                   error.response?.data?.error || 
                                   'Failed to confirm email. The link may be invalid or expired.';
                setMessage(errorMessage);
                setTimeout(() => navigate('/'), 5000);
            }
        };

        confirmEmail();
    }, [searchParams, navigate]);

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <>
                        <CircularProgress 
                            size={60} 
                            thickness={4}
                            sx={{ 
                                color: '#3D5A80',
                                mb: 3 
                            }} 
                        />
                        <PixelTypography 
                            variant="h6" 
                            sx={{ 
                                fontSize: { xs: '0.75rem', sm: '1rem' },
                                lineHeight: 1.8,
                                color: '#2C2C2C'
                            }}
                        >
                            Verifying your email...
                        </PixelTypography>
                    </>
                );
            
            case 'success':
                return (
                    <>
                        <CheckCircleIcon 
                            sx={{ 
                                fontSize: 80,
                                color: '#4CAF50',
                                mb: 2
                            }} 
                        />
                        <Alert 
                            severity="success" 
                            icon={false}
                            sx={{ 
                                borderRadius: 0,
                                border: '3px solid #2C2C2C',
                                backgroundColor: '#C8E6C9',
                                mb: 2
                            }}
                        >
                            <PixelTypography 
                                variant="h6" 
                                sx={{ 
                                    fontSize: { xs: '0.75rem', sm: '1rem' },
                                    lineHeight: 1.8,
                                    color: '#2C2C2C'
                                }}
                            >
                                {message}
                            </PixelTypography>
                        </Alert>
                    </>
                );
            
            case 'error':
                return (
                    <>
                        <ErrorIcon 
                            sx={{ 
                                fontSize: 80,
                                color: '#F44336',
                                mb: 2
                            }} 
                        />
                        <Alert 
                            severity="error"
                            icon={false}
                            sx={{ 
                                borderRadius: 0,
                                border: '3px solid #2C2C2C',
                                backgroundColor: '#FFCDD2',
                                mb: 2
                            }}
                        >
                            <PixelTypography 
                                variant="h6" 
                                sx={{ 
                                    fontSize: { xs: '0.75rem', sm: '1rem' },
                                    lineHeight: 1.8,
                                    color: '#2C2C2C'
                                }}
                            >
                                {message}
                            </PixelTypography>
                        </Alert>
                    </>
                );
            
            default:
                return null;
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#98C1D9',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <StyledContainer>
                <StyledCard>
                    <StyledCardContent>
                        <PixelTypography 
                            variant="h4" 
                            gutterBottom
                            sx={{ 
                                fontSize: { xs: '1rem', sm: '1.5rem' },
                                mb: 4,
                                color: '#3D5A80'
                            }}
                        >
                            Email Confirmation
                        </PixelTypography>
                        
                        {renderContent()}
                    </StyledCardContent>
                </StyledCard>
            </StyledContainer>
        </Box>
    );
}

export default ConfirmEmail;
