import React from 'react';
import { Link } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { Grid, Box, useMediaQuery, useTheme } from '@mui/material';
import { FlightTakeoff, AccountCircle, AddLocation, Favorite, Flight, WhereToVote } from '@mui/icons-material';
import CenteredTemplate from '../Component/Commons/CenteredTemplate';
import MushaShugyo from '../Component/Trips/MushaShugyo';
import StepCard from '../Component/Commons/StepCard';
import {
  PixelTypography,
  StyledContainer,
  StyledHeaderCard,
  StyledHeaderContent,
  StyledSectionCard,
  StyledSectionHeader,
  StyledSectionContent,
  PixelButton,
} from '../Css/pixel.styles';
import { StyledStepCard, StyledAvatar } from '../Css/Home.styles';

function Home() {
  useSeoMeta({
    title: 'AdondeVamos - Plan and Share Travel Itineraries',
    description: 'Discover, create, and share travel itineraries and places with AdondeVamos.',
    ogTitle: 'AdondeVamos - Plan and Share Travel Itineraries',
    ogDescription: 'Discover, create, and share travel itineraries and places with AdondeVamos.',
    ogType: 'website',
  });
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <CenteredTemplate>
      <StyledContainer>
        {/* Header Section */}
        <StyledHeaderCard>
          <StyledHeaderContent>
            <PixelTypography 
                variant={isSmUp ? "h3" : "h4"} 
                sx={{
                    fontSize: isSmUp ? '1.5rem' : '1.2rem',
                    color: '#FFFFFF',
                    mb: 2,
                    lineHeight: 1.4
                }}
            >
                AdondeVamos.net
            </PixelTypography>
            <PixelTypography
              sx={{
                  fontSize: isSmUp ? '0.6rem' : '0.5rem',
                  color: '#2C2C2C',
                  lineHeight: 1.6,
                  mt: 1,
              }}
          >
             Share your travel plans and discover new places with friends.
          </PixelTypography>
          </StyledHeaderContent>

        </StyledHeaderCard>

        <StyledSectionCard>
          <StyledSectionHeader>
           <PixelTypography 
                variant="h5" 
                sx={{ 
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    color: '#FFFFFF'
                }}
            >
                What is Adondevamos?
            </PixelTypography>
          </StyledSectionHeader>
          <StyledSectionContent>
            <PixelTypography 
                variant="body2" 
                sx={{ 
                    fontSize: { xs: '0.5rem', sm: '0.6rem' },
                    color: '#E8F4FD',
                    lineHeight: 1.6
                }}
            >
                AdondeVamos is a platform designed to help you plan trips with your friends by allowing everyone to suggest and vote on places to visit.
            </PixelTypography>
          </StyledSectionContent>
        </StyledSectionCard>
        <StyledSectionCard>
          <StyledSectionHeader>
            <PixelTypography 
                variant="h5" 
                sx={{ 
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    color: '#FFFFFF'
                }}
            >
                Where do you want to go today?
            </PixelTypography>
          </StyledSectionHeader>
          <StyledSectionContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <PixelButton
                startIcon={<Flight sx={{ fontSize: '1rem' }} />}
                component={Link}
                to="/Trips"
                fullWidth
              >
                Explore Trips
              </PixelButton>

              <PixelButton
                startIcon={<WhereToVote sx={{ fontSize: '1rem' }} />}
                component={Link}
                to="/Places"
                fullWidth
              >
                Explore Places
              </PixelButton>
            </Box>
          </StyledSectionContent>
        </StyledSectionCard>
        {/* How to Use Section */}
        <StyledSectionCard>
          <StyledSectionHeader>
            <PixelTypography 
                variant="h5" 
                sx={{ 
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    color: '#FFFFFF'
                }}
            >
                How to use it?
            </PixelTypography>
          </StyledSectionHeader>
          <StyledSectionContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StepCard
                  icon={FlightTakeoff}
                  title="Add your trip"
                  subtitle="You just need a cool name"
                  cardColor="#F5F5F5"
                  avatarColor="#4A4A4A"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StepCard
                  icon={AccountCircle}
                  title="Add your friends"
                  subtitle="Invite others to join the plan"
                  cardColor="#E8E8E8"
                  avatarColor="#6B6B6B"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StepCard
                  icon={AddLocation}
                  title="Add places"
                  subtitle="Add places you want to visit"
                  cardColor="#DCDCDC"
                  avatarColor="#808080"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StepCard
                  icon={Favorite}
                  title="Vote"
                  subtitle="Vote and decide where to go"
                  cardColor="#D3D3D3"
                  avatarColor="#2F2F2F"
                />
              </Grid>
            </Grid>
          </StyledSectionContent>
        </StyledSectionCard>
        {/* Featured Story Section */}
        <StyledSectionCard>
          <StyledSectionHeader>
            <PixelTypography 
                variant="h6" 
                sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    color: '#FFFFFF'
                }}
            >
                The trip that changed my life
            </PixelTypography>
          </StyledSectionHeader>
          <StyledSectionContent>
            <PixelTypography 
                variant="body2" 
                sx={{ 
                    fontSize: { xs: '0.5rem', sm: '0.6rem' },
                    color: '#2C2C2C',
                    mb: 2,
                    lineHeight: 1.6
                }}
            >
                Main reason to create AdondeVamos
            </PixelTypography>
            <MushaShugyo />
          </StyledSectionContent>
        </StyledSectionCard>
      </StyledContainer>
    </CenteredTemplate>
  );
}

export default Home;