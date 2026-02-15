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
  useTheme
} from '@mui/material';
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

const StepCard = ({ icon: Icon, title, subtitle }) => (
  <Paper
    elevation={1}
    sx={{
      display: 'flex',
      gap: 2,
      alignItems: 'center',
      p: 2,
      borderRadius: 2,
      backgroundColor: 'rgba(255,255,255,0.9)'
    }}
  >
    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
      <Icon sx={{ fontSize: 28 }} />
    </Avatar>
    <Box>
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  </Paper>
);

function Home() {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <CenteredTemplate>
      <Box sx={{ width: '100%' }}>
        <Typography 
            variant={isSmUp ? "h3" : "h4"} 
            align="center"
            sx={{
                fontFamily: "'Press Start 2P', cursive",
                color: '#2c3e50',
                fontSize: isSmUp ? '1.5rem' : '1.2rem',
                lineHeight: 1.6,
                mb: 1,
                textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
            }}
        >
            AdondeVamos.net
        </Typography>

        <Typography variant="h6"  align="center">
          What is Adondevamos?
        </Typography>
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4 }}>
          AdondeVamos is a platform designed to help you plan trips with your friends by allowing everyone to suggest and vote on places to visit.
        </Typography>
        <Typography variant="h6" align="center" sx={{ mt: 1 }}>
          Where do you want to go today?
        </Typography>

          <ButtonGroup
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            <Button
              startIcon={<Flight />}
              component={Link}
              to="/Trips"
            >
              Explore Trips
            </Button>

            <Button
              variant="outlined"
              startIcon={<WhereToVote />}
              component={Link}
              to="/Places"
            >
              Explore Places
            </Button>
          </ButtonGroup>
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
          How to use it?
        </Typography>

        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <StepCard
              icon={FlightTakeoff}
              title="Add your trip"
              subtitle="You just need a cool name"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <StepCard
              icon={AccountCircle}
              title="Add your friends"
              subtitle="Invite others to join the plan"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <StepCard
              icon={AddLocation}
              title="Add places"
              subtitle="Add places that you and your friends want to visit"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <StepCard
              icon={Favorite}
              title="Vote"
              subtitle="Vote and decide where to go"
            />
          </Grid>
        </Grid>
        <Typography variant="body1" 
        align="left" sx={{ mt: 2, mb: 2 }}>
          The trip that changed my life and main reason to create AdondeVamos
        </Typography>
        <MushaShugyo />

        
      </Box>
    </CenteredTemplate>
  );
}

export default Home;