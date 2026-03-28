import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  ButtonGroup,
  Button,
  Paper,
  Avatar,
  useMediaQuery,
  useTheme,
  Card,
  CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  FlightTakeoff,
  AccountCircle,
  AddLocation,
  Favorite,
  Flight,
  WhereToVote
} from '@mui/icons-material';
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import MushaShugyo from '../Component/Trips/MushaShugyo';

// 8-bit Styled Components
const StyledContainer = styled(Box)(({ theme }) => ({
    maxWidth: '800px',
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

const StyledSectionCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    marginBottom: theme.spacing(3),
}));

const StyledSectionHeader = styled(Box)(({ theme }) => ({
    backgroundColor: '#52B788',
    padding: theme.spacing(2),
    borderBottom: '4px solid #2C2C2C',
}));

const StyledSectionContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#E0AC69',
    padding: theme.spacing(2),
    '&:last-child': {
        paddingBottom: theme.spacing(2),
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: 0,
    border: '2px solid #2C2C2C',
    backgroundColor: '#FFFFFF',
    color: '#2C2C2C',
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.6rem',
    padding: theme.spacing(1.5, 2),
    '&:hover': {
        backgroundColor: '#F8F8F8',
        transform: 'translateY(-2px)',
        boxShadow: '3px 3px 0px #2C2C2C',
    },
    transition: 'all 0.2s ease-in-out',
}));

const PixelTypography = styled(Typography)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
}));

const StyledStepCard = styled(Paper)(({ theme, cardcolor }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    backgroundColor: cardcolor || '#E0AC69',
    padding: theme.spacing(2),
    display: 'flex',
    gap: 2,
    alignItems: 'center',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '10px 10px 0px rgba(0,0,0,0.3)',
    },
    transition: 'all 0.2s ease-in-out',
}));

const StyledAvatar = styled(Avatar)(({ theme, avatarcolor }) => ({
    backgroundColor: avatarcolor || '#3D5A80',
    border: '2px solid #2C2C2C',
    borderRadius: 0,
    width: 56,
    height: 56,
}));

const StepCard = ({ icon: Icon, title, subtitle, cardColor, avatarColor }) => (
  <StyledStepCard cardcolor={cardColor}>
    <StyledAvatar avatarcolor={avatarColor}>
      <Icon sx={{ fontSize: 28, color: '#FFFFFF' }} />
    </StyledAvatar>
    <Box>
      <PixelTypography variant="subtitle1" sx={{ fontSize: '0.7rem', color: '#2C2C2C', mb: 1 }}>
        {title}
      </PixelTypography>
      <PixelTypography variant="body2" sx={{ fontSize: '0.5rem', color: '#2C2C2C', lineHeight: 1.4 }}>
        {subtitle}
      </PixelTypography>
    </Box>
  </StyledStepCard>
);

function Home() {
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
                variant="body1" 
                sx={{ 
                    fontSize: { xs: '0.6rem', sm: '0.8rem' },
                    color: '#E8F4FD',
                    mb: 2,
                    lineHeight: 1.6
                }}
            >
                What is Adondevamos?
            </PixelTypography>

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
          </StyledHeaderContent>
        </StyledHeaderCard>

        {/* Navigation Section */}
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
              <StyledButton
                startIcon={<Flight sx={{ fontSize: '1rem' }} />}
                component={Link}
                to="/Trips"
                fullWidth
              >
                Explore Trips
              </StyledButton>

              <StyledButton
                startIcon={<WhereToVote sx={{ fontSize: '1rem' }} />}
                component={Link}
                to="/Places"
                fullWidth
              >
                Explore Places
              </StyledButton>
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