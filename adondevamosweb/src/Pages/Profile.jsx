import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { Container, Box, Typography, Card, CardContent, CircularProgress } from "@mui/material";
import { styled } from '@mui/material/styles';
import  ProfileDetails from "../Component/Users/ProfileDefails";
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import config from "../Resources/config";

// 8-bit Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
    maxWidth: '600px !important',
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

const StyledContentCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    backgroundColor: '#E0AC69',
}));

const StyledContentArea = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#E0AC69',
    padding: theme.spacing(3),
    '&:last-child': {
        paddingBottom: theme.spacing(3),
    },
}));

const PixelTypography = styled(Typography)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
}));

const StyledLoadingCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    backgroundColor: '#52B788',
    padding: theme.spacing(4),
    textAlign: 'center',
}));

export default function Profile() {

    const [userInfo, setUserInfo] = useState(null);
    const auth = useAuth();
    const URLs = {
        Site: `${config.api.baseUrl}`
      };
    useEffect(() => {
        const fetchUserInfo = async () => {
            
            try {
                const response = await axios.get(`${URLs.Site}/Users/${auth.user}`, {
                    withCredentials: true
                });

                setUserInfo(response.data.info);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        if (auth.user) {
            fetchUserInfo();
        }
    }, [auth.user]);

    if (!userInfo) {
        return (
            <CenteredTemplate>
                <StyledContainer>
                    <StyledLoadingCard>
                        <CircularProgress 
                            sx={{ 
                                color: '#FFFFFF',
                                mb: 2
                            }} 
                        />
                        <PixelTypography 
                            sx={{ 
                                fontSize: '0.7rem',
                                color: '#FFFFFF'
                            }}
                        >
                            Loading profile...
                        </PixelTypography>
                    </StyledLoadingCard>
                </StyledContainer>
            </CenteredTemplate>
        );
    }
    return (
        <CenteredTemplate>
            <StyledContainer>
                {/* Header Section */}
                <StyledHeaderCard>
                    <StyledHeaderContent>
                        <PixelTypography 
                            variant="h4" 
                            sx={{
                                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                                color: '#FFFFFF',
                                mb: 1,
                                lineHeight: 1.4
                            }}
                        >
                            User Profile
                        </PixelTypography>
                    </StyledHeaderContent>
                </StyledHeaderCard>

                {/* Profile Content */}
                <StyledContentCard>
                    <StyledContentArea>
                        <ProfileDetails user={userInfo} />
                    </StyledContentArea>
                </StyledContentCard>
            </StyledContainer>
        </CenteredTemplate>
    );
}
