import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useSeoMeta } from '@unhead/react';
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";
import ProfileDetails from "../Component/Users/ProfileDefails";
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import config from "../Resources/config";
import ProfilePhotoUpload from "../Component/Users/ProfilePhotoUpload";
import {
  PixelTypography,
  StyledHeaderCard,
  StyledHeaderContent,
  StyledContentCard,
  StyledContentArea,
  StyledProfileContainer,
  StyledLoadingCard,
  UserInfo,
  ProfileData,
} from '../Css/Profile.styles';

export default function Profile() {

    useSeoMeta({
        title: 'My Profile - AdondeVamos',
        description: 'View and edit your AdondeVamos profile, trips and settings.',
        ogTitle: 'My Profile - AdondeVamos',
    });
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
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

        const fetchProfileData = async () => {
            try {
                const response = await axios.get(
                    `${URLs.Site}/Users/${auth.user}/Profile`,
                    { withCredentials: true }
                );

                if (response.status === 200) {
                    setProfileData(response.data.info);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        if (auth.user) {
            fetchUserInfo();
            fetchProfileData();
        }
    }, [auth.user]);

    if (!userInfo) {
        return (
            <CenteredTemplate>
                <StyledProfileContainer>
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
                </StyledProfileContainer>
            </CenteredTemplate>
        );
    }
    return (
        <CenteredTemplate>
            <StyledProfileContainer>
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
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <ProfilePhotoUpload
                                currentThumbnail={localStorage.getItem('thumbnail')}
                                userId={auth.user}
                                onUpdate={(newThumbnail) => {
                                    setUserInfo(prev => ({ ...prev, thumbnail: newThumbnail }));
                                }}
                                currentPhotoUrl={localStorage.getItem('thumbnail')}
                                showText={false}
                            />
                        </Box>
                        <ProfileDetails 
                            user={userInfo} 
                            createdTrips={profileData?.createdTrips || []}
                            votedTrips={profileData?.votedTrips || []}
                            voteCounts={profileData?.voteCounts || { trips: 0, places: 0 }}
                        />
                    </StyledContentArea>
                </StyledContentCard>
            </StyledProfileContainer>
        </CenteredTemplate>
    );
}
